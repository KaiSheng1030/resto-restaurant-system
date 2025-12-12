import React, { useState, useEffect, useRef } from "react";
import "./FloorPlanEditor.css";
import { getFloorPlanLayout, saveFloorPlanLayout } from "../api";

export default function FloorPlanEditor({ tables = [], onClose, lang = "en" }) {
  const [isEditMode, setIsEditMode] = useState(true);
  const [positions, setPositions] = useState(() => {
    const defaultPos = getDefaultPositions(tables);
    return {
      ...defaultPos,
      tables: defaultPos.tables || {},
    };
  });
  const [rotations, setRotations] = useState({});
  const [sizes, setSizes] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);
  const initialMousePos = useRef(null);

  // Update positions when tables prop changes
  useEffect(() => {
    // Only run on mount when positions haven't been set yet
    // Don't reload positions constantly as tables change due to polling
    if (positions.tables && Object.keys(positions.tables).length > 0) {
      return; // Already loaded, don't reload
    }

    const updateTablePositions = async () => {
      try {
        // Load latest saved positions from backend
        const res = await getFloorPlanLayout();
        const savedPositions = res.data;
        
        setPositions(prevPositions => {
          const newTablePositions = {};
          tables.forEach((table) => {
            const tableId = table.id;
            // Priority: saved backend position > existing local position > default
            if (savedPositions?.tables?.[tableId]) {
              newTablePositions[tableId] = savedPositions.tables[tableId];
            } else if (prevPositions.tables && prevPositions.tables[tableId]) {
              newTablePositions[tableId] = prevPositions.tables[tableId];
            } else {
              const capacity = table.capacity;
              const pos = getDefaultTablePosition(tableId, capacity);
              newTablePositions[tableId] = { top: pos.top, left: pos.left };
            }
          });
          
          return {
            ...prevPositions,
            tables: newTablePositions
          };
        });
      } catch (err) {
        // If backend fetch fails, use local state
        setPositions(prevPositions => {
          const newTablePositions = {};
          tables.forEach((table) => {
            const tableId = table.id;
            if (prevPositions.tables && prevPositions.tables[tableId]) {
              newTablePositions[tableId] = prevPositions.tables[tableId];
            } else {
              const capacity = table.capacity;
              const pos = getDefaultTablePosition(tableId, capacity);
              newTablePositions[tableId] = { top: pos.top, left: pos.left };
            }
          });
          
          return {
            ...prevPositions,
            tables: newTablePositions
          };
        });
      }
    };
    
    updateTablePositions();
  }, []);

  const t = {
    en: {
      title: "Floor Plan Editor",
      editMode: "Edit Mode",
      viewMode: "View Mode",
      toggleEdit: "Toggle Edit Mode",
      save: "Save Layout",
      reset: "Reset to Default",
      cancel: "Cancel",
      gridSnap: "Grid Snap",
      lockElements: "Lock Elements",
      unlockAll: "Unlock All",
      saved: "Layout saved successfully!",
      resetConfirm: "Are you sure you want to reset to default layout?",
      instructions: "Drag elements to reposition them.",
      table: "Table",
      seats: "seats",
      entrance: "Entrance",
      counter: "Counter",
      kitchen: "Kitchen",
      restroom: "Restroom",
    },
    zh: {
      title: "平面图编辑器",
      editMode: "编辑模式",
      viewMode: "查看模式",
      toggleEdit: "切换编辑模式",
      save: "保存布局",
      reset: "恢复默认",
      cancel: "取消",
      gridSnap: "网格吸附",
      lockElements: "锁定元素",
      unlockAll: "解锁全部",
      saved: "布局保存成功！",
      resetConfirm: "确定要恢复默认布局吗？",
      instructions: "拖动元素以重新定位。",
      table: "餐桌",
      seats: "座位",
      entrance: "入口",
      counter: "柜台",
      kitchen: "厨房",
      restroom: "洗手间",
    },
  };

  // Load saved layout only on mount, don't reload on tables change
  useEffect(() => {
    loadSavedLayout();
  }, []);

  const loadSavedLayout = async () => {
    try {
      const res = await getFloorPlanLayout();
      console.log("Loaded layout from backend:", res.data);
      if (res.data && Object.keys(res.data).length > 0) {
        const loadedData = { ...res.data };
        
        // Always remove old restroom data from elements (clean up legacy data)
        const { restroom1, restroom2, ...otherElements} = loadedData.elements || {};
        loadedData.elements = otherElements;
        
        // If restrooms array doesn't exist, migrate from old format or use defaults
        if (!loadedData.restrooms || loadedData.restrooms.length === 0) {
          loadedData.restrooms = [];
          
          // Convert restroom1 if it exists
          if (restroom1) {
            loadedData.restrooms.push({
              id: "wc1",
              top: restroom1.top || "2%",
              left: restroom1.left || (restroom1.right ? `${100 - parseFloat(restroom1.right)}%` : "92%")
            });
          }
          
          // Convert restroom2 if it exists
          if (restroom2) {
            loadedData.restrooms.push({
              id: "wc2",
              top: restroom2.top || "2%",
              left: restroom2.left || (restroom2.right ? `${100 - parseFloat(restroom2.right)}%` : "86%")
            });
          }
          
          // If no restrooms found, use defaults
          if (loadedData.restrooms.length === 0) {
            loadedData.restrooms = [
              { id: "wc1", top: "2%", left: "92%" },
              { id: "wc2", top: "2%", left: "86%" },
            ];
          }
        }
        
        console.log("Setting positions with restrooms:", loadedData.restrooms);
        setPositions(loadedData);
        
        // Load rotations if they exist
        if (loadedData.rotations) {
          setRotations(loadedData.rotations);
        }
        
        // Load sizes if they exist
        if (loadedData.sizes) {
          setSizes(loadedData.sizes);
        }
      }
    } catch (err) {
      console.log("No saved layout, using default:", err.message);
    }
  };

  // Get default positions
  function getDefaultPositions(tables) {
    const defaultTables = {};
    tables.forEach((table) => {
      const tableId = table.id;
      const capacity = table.capacity;
      const pos = getDefaultTablePosition(tableId, capacity);
      defaultTables[tableId] = { top: pos.top, left: pos.left };
    });

    return {
      tables: defaultTables,
      elements: {
        entrance: { bottom: "2%", left: "43%" },
        kitchen: { top: "2%", left: "3%", width: "140px", height: "80px" },
        counter: { bottom: "8%", left: "18%" },
      },
      restrooms: [
        { id: "wc1", top: "2%", left: "92%" },
        { id: "wc2", top: "2%", left: "86%" },
      ],
      windows: [
        { top: "20%", left: "1%" },
        { top: "42%", left: "1%" },
        { top: "64%", left: "1%" },
      ],
    };
  }

  function getDefaultTablePosition(tableId, capacity) {
    const positions = {
      1: { top: "20%", left: "10%" },
      2: { top: "42%", left: "10%" },
      3: { top: "20%", left: "28%" },
      4: { top: "20%", left: "46%" },
      5: { top: "22%", left: "68%" },
      6: { top: "50%", left: "28%" },
      7: { top: "50%", left: "46%" },
      8: { top: "16%", left: "87%" },
      9: { top: "32%", left: "87%" },
      10: { top: "75%", left: "30%" },
      11: { top: "50%", left: "68%" },
      12: { top: "75%", left: "53%" },
      13: { top: "75%", left: "72%" },
    };

    // For new tables, place them in a grid pattern below existing tables
    return (
      positions[tableId] || {
        top: `${85 + Math.floor((tableId - 14) / 3) * 12}%`,
        left: `${15 + ((tableId - 14) % 3) * 30}%`,
      }
    );
  }

  // Handle mouse down to start dragging
  const handleMouseDown = (e, type, id) => {
    if (!isEditMode) return;

    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget;
    const targetRect = target.getBoundingClientRect();
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    // Get the computed style to check for padding
    const containerStyle = window.getComputedStyle(container);
    const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;
    const paddingTop = parseFloat(containerStyle.paddingTop) || 0;

    // Calculate content area (excluding padding)
    const contentWidth = containerRect.width - (paddingLeft * 2);
    const contentHeight = containerRect.height - (paddingTop * 2);

    // Calculate where the element currently is relative to content area (as percentage)
    const currentLeftPct = ((targetRect.left - containerRect.left - paddingLeft) / contentWidth) * 100;
    const currentTopPct = ((targetRect.top - containerRect.top - paddingTop) / contentHeight) * 100;

    // Calculate where we clicked relative to the element's top-left corner (as percentage of content area)
    const offsetXPct = ((e.clientX - targetRect.left) / contentWidth) * 100;
    const offsetYPct = ((e.clientY - targetRect.top) / contentHeight) * 100;

    // For elements with right/bottom positioning, convert their position to left/top FIRST
    // This ensures the element stays in place visually before dragging starts
    // (Restrooms are now treated like tables so no conversion needed)
    if (type === "element") {
      setPositions(prev => {
        const element = prev.elements[id];
        if (element && (element.right !== undefined || element.bottom !== undefined)) {
          const newPositions = { ...prev };
          const { right, bottom, ...restElement } = element;
          newPositions.elements[id] = {
            ...restElement,
            top: `${currentTopPct}%`,
            left: `${currentLeftPct}%`,
          };
          return newPositions;
        }
        return prev;
      });
    }

    setDraggedItem({ 
      type, 
      id,
      elementWidth: targetRect.width,
      elementHeight: targetRect.height
    });
    setDragOffset({
      x: offsetXPct,
      y: offsetYPct,
    });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (!draggedItem || !isEditMode) return;

    // Set dragging to true once mouse moves (prevents accidental position changes on click)
    setIsDragging(true);

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Get the computed style to check for padding
    const containerStyle = window.getComputedStyle(container);
    const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;
    const paddingTop = parseFloat(containerStyle.paddingTop) || 0;

    // Calculate content area (excluding padding)
    const contentWidth = rect.width - (paddingLeft * 2);
    const contentHeight = rect.height - (paddingTop * 2);

    // Calculate mouse position as percentage relative to content area
    const mouseXPct = ((e.clientX - rect.left - paddingLeft) / contentWidth) * 100;
    const mouseYPct = ((e.clientY - rect.top - paddingTop) / contentHeight) * 100;
    
    // Subtract the offset to get the element's top-left position
    let newLeft = mouseXPct - dragOffset.x;
    let newTop = mouseYPct - dragOffset.y;
    
    // Boundary constraints (keep elements within 0-95% range)
    newLeft = Math.max(1, Math.min(95, newLeft));
    newTop = Math.max(1, Math.min(95, newTop));

    const newPositions = { ...positions };

    if (draggedItem.type === "table") {
      newPositions.tables = {
        ...newPositions.tables,
        [draggedItem.id]: {
          top: `${newTop}%`,
          left: `${newLeft}%`,
        }
      };
    } else if (draggedItem.type === "restroom") {
      // Update restroom position (create new array to avoid mutations)
      newPositions.restrooms = newPositions.restrooms.map(restroom => 
        restroom.id === draggedItem.id
          ? {
              ...restroom,
              top: `${newTop}%`,
              left: `${newLeft}%`,
            }
          : restroom
      );
    } else if (draggedItem.type === "element") {
      const element = newPositions.elements[draggedItem.id];
      
      // Remove any right/bottom positioning and use left/top
      const { right, bottom, ...restElement } = element;
      newPositions.elements = {
        ...newPositions.elements,
        [draggedItem.id]: {
          ...restElement,
          top: `${newTop}%`,
          left: `${newLeft}%`,
        }
      };
    } else if (draggedItem.type === "window") {
      let newLeft = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
      let newTop = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;
      
      newLeft = Math.max(1, Math.min(95, newLeft));
      newTop = Math.max(1, Math.min(95, newTop));
      
      newPositions.windows[draggedItem.id] = {
        top: `${newTop}%`,
        left: `${newLeft}%`,
      };
    }

    setPositions(newPositions);
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setDraggedItem(null);
    setIsDragging(false);
    initialMousePos.current = null;
  };

  // Save layout to backend
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSave = { ...positions, rotations, sizes };
      console.log("Saving layout with restrooms:", dataToSave.restrooms);
      const response = await saveFloorPlanLayout(dataToSave);
      console.log("Save response:", response);
      alert(t[lang].saved);
      // Just close modal, floor plan will reload automatically
      if (onClose) onClose(true); // Pass true to indicate refresh needed
    } catch (err) {
      console.error("Save error:", err);
      const errorMsg = err.response?.data?.error || err.message || "Unknown error";
      alert(`Error saving layout: ${errorMsg}\n\nPlease make sure the backend server is running on port 5000.`);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default layout
  const handleReset = () => {
    if (window.confirm(t[lang].resetConfirm)) {
      setPositions(getDefaultPositions(tables));
      setRotations({});
      setSizes({});
      setSelectedItem(null);
    }
  };

  // Handle rotation change
  const handleRotationChange = (value) => {
    if (!selectedItem) return;
    const angle = parseInt(value) || 0;
    const key = `${selectedItem.type}-${selectedItem.id}`;
    setRotations(prev => ({ ...prev, [key]: angle }));
  };

  // Get rotation for an element
  const getRotation = (type, id) => {
    const key = `${type}-${id}`;
    return rotations[key] || 0;
  };

  // Handle rotation drag start
  const handleRotationMouseDown = (e, type, id) => {
    e.stopPropagation();
    e.preventDefault();
    
    const element = e.currentTarget.parentElement;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const key = `${type}-${id}`;
    const startRotation = rotations[key] || 0;
    let lastAngle = null;
    let totalRotation = startRotation;
    
    const handleRotationDrag = (moveEvent) => {
      const deltaX = moveEvent.clientX - centerX;
      const deltaY = moveEvent.clientY - centerY;
      const currentAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
      const normalizedCurrentAngle = ((currentAngle % 360) + 360) % 360;
      
      if (lastAngle !== null) {
        // Calculate angle difference
        let angleDiff = normalizedCurrentAngle - lastAngle;
        
        // Handle wrapping around 0/360
        if (angleDiff > 180) {
          angleDiff -= 360;
        } else if (angleDiff < -180) {
          angleDiff += 360;
        }
        
        // Add the difference to total rotation
        totalRotation += angleDiff;
        
        // Normalize to 0-360 range
        let normalizedAngle = ((totalRotation % 360) + 360) % 360;
        
        // Snap to 0°, 90°, 180°, 270° when within 5 degrees
        const snapThreshold = 5;
        const snapAngles = [0, 90, 180, 270, 360];
        for (let snapAngle of snapAngles) {
          if (Math.abs(normalizedAngle - snapAngle) < snapThreshold) {
            normalizedAngle = snapAngle % 360;
            totalRotation = normalizedAngle;
            break;
          }
        }
        
        setRotations(prev => ({ ...prev, [key]: Math.round(normalizedAngle) }));
      }
      
      lastAngle = normalizedCurrentAngle;
    };
    
    const handleRotationEnd = () => {
      document.removeEventListener('mousemove', handleRotationDrag);
      document.removeEventListener('mouseup', handleRotationEnd);
    };
    
    document.addEventListener('mousemove', handleRotationDrag);
    document.addEventListener('mouseup', handleRotationEnd);
  };

  // Get size for an element
  const getSize = (type, id) => {
    const key = `${type}-${id}`;
    return sizes[key] || {};
  };

  // Handle resize start
  const handleResizeMouseDown = (e, type, id) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    
    const element = e.currentTarget.parentElement;
    const rect = element.getBoundingClientRect();
    
    const startWidth = rect.width;
    const startHeight = rect.height;
    const startX = e.clientX;
    const startY = e.clientY;
    
    // Store the current positions to prevent other elements from moving
    const frozenPositions = JSON.parse(JSON.stringify(positions));
    
    const handleResizeDrag = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      const newWidth = Math.max(60, startWidth + deltaX);
      const newHeight = Math.max(40, startHeight + deltaY);
      
      const key = `${type}-${id}`;
      
      // Update only the size, ensure positions stay frozen
      setSizes(prev => ({
        ...prev,
        [key]: {
          width: `${newWidth}px`,
          height: `${newHeight}px`
        }
      }));
      
      // Restore frozen positions to prevent drift
      setPositions(frozenPositions);
    };
    
    const handleResizeEnd = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleResizeDrag);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
    
    document.addEventListener('mousemove', handleResizeDrag);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  // Get table size class
  const getTableSize = (capacity) => {
    if (capacity >= 10) return "xlarge";
    if (capacity >= 6) return "large";
    if (capacity >= 4) return "medium";
    if (capacity >= 2) return "small";
    return "tiny";
  };

  // Attach global mouse handlers when dragging
  useEffect(() => {
    if (draggedItem) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [draggedItem, dragOffset, positions]);

  return (
    <div className="floor-plan-editor-overlay">
      <div className="floor-plan-editor-modal">
        <div className="editor-header">
          <h2>{t[lang].title}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="editor-toolbar">
          <div className="toolbar-group">
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>
              {t[lang].instructions}
            </div>
          </div>

          <div className="toolbar-actions">
            <button className="editor-btn btn-cancel" onClick={onClose}>
              {t[lang].cancel}
            </button>
            <button
              className="editor-btn btn-save"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "..." : t[lang].save}
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className={`floor-plan-editor-map ${isEditMode ? "edit-mode" : ""} ${
            draggedItem ? "dragging" : ""
          }`}
          onClick={(e) => {
            // Deselect if clicking on the background
            if (e.target === e.currentTarget) {
              setSelectedItem(null);
            }
          }}
        >
          {/* Entrance */}
          <div
            className={`floor-element entrance ${
              draggedItem?.id === "entrance" ? "dragging-active" : ""
            } ${selectedItem?.type === "element" && selectedItem?.id === "entrance" ? "selected" : ""}`}
            style={{
              ...positions.elements.entrance,
              ...getSize("element", "entrance"),
              ...(getRotation("element", "entrance") !== 0 && { transform: `rotate(${getRotation("element", "entrance")}deg)` })
            }}
            onMouseDown={(e) => !isResizing && handleMouseDown(e, "element", "entrance")}
            onClick={() => setSelectedItem({ type: "element", id: "entrance" })}
          >
            <span className="element-label">{t[lang].entrance}</span>
            {selectedItem?.type === "element" && selectedItem?.id === "entrance" && (
              <>
                <div 
                  className="rotation-handle"
                  onMouseDown={(e) => handleRotationMouseDown(e, "element", "entrance")}
                />
                <div 
                  className="resize-handle"
                  onMouseDown={(e) => handleResizeMouseDown(e, "element", "entrance")}
                />
              </>
            )}
          </div>

          {/* Counter */}
          <div
            className={`floor-element counter ${
              draggedItem?.id === "counter" ? "dragging-active" : ""
            } ${selectedItem?.type === "element" && selectedItem?.id === "counter" ? "selected" : ""}`}
            style={{
              ...positions.elements.counter,
              ...getSize("element", "counter"),
              ...(getRotation("element", "counter") !== 0 && { transform: `rotate(${getRotation("element", "counter")}deg)` })
            }}
            onMouseDown={(e) => !isResizing && handleMouseDown(e, "element", "counter")}
            onClick={() => setSelectedItem({ type: "element", id: "counter" })}
          >
            <span className="element-label">{t[lang].counter}</span>
            {selectedItem?.type === "element" && selectedItem?.id === "counter" && (
              <>
                <div 
                  className="rotation-handle"
                  onMouseDown={(e) => handleRotationMouseDown(e, "element", "counter")}
                />
                <div 
                  className="resize-handle"
                  onMouseDown={(e) => handleResizeMouseDown(e, "element", "counter")}
                />
              </>
            )}
          </div>

          {/* Kitchen */}
          <div
            className={`floor-element kitchen ${
              draggedItem?.id === "kitchen" ? "dragging-active" : ""
            } ${selectedItem?.type === "element" && selectedItem?.id === "kitchen" ? "selected" : ""}`}
            style={{
              ...positions.elements.kitchen,
              ...getSize("element", "kitchen"),
              ...(getRotation("element", "kitchen") !== 0 && { transform: `rotate(${getRotation("element", "kitchen")}deg)` })
            }}
            onMouseDown={(e) => !isResizing && handleMouseDown(e, "element", "kitchen")}
            onClick={() => setSelectedItem({ type: "element", id: "kitchen" })}
          >
            <span className="element-label">{t[lang].kitchen}</span>
            {selectedItem?.type === "element" && selectedItem?.id === "kitchen" && (
              <>
                <div 
                  className="rotation-handle"
                  onMouseDown={(e) => handleRotationMouseDown(e, "element", "kitchen")}
                />
                <div 
                  className="resize-handle"
                  onMouseDown={(e) => handleResizeMouseDown(e, "element", "kitchen")}
                />
              </>
            )}
          </div>

          {/* Restrooms - now treated like tables */}
          {(positions.restrooms || []).map((restroom) => {
            const isDragging = draggedItem?.id === restroom.id && draggedItem?.type === "restroom";
            const isSelected = selectedItem?.type === "restroom" && selectedItem?.id === restroom.id;
            return (
              <div
                key={restroom.id}
                className={`floor-element restroom ${
                  isDragging ? "dragging-active" : ""
                } ${isSelected ? "selected" : ""}`}
                style={{
                  top: restroom.top,
                  left: restroom.left,
                  ...getSize("restroom", restroom.id),
                  ...(getRotation("restroom", restroom.id) !== 0 && { transform: `rotate(${getRotation("restroom", restroom.id)}deg)` })
                }}
                onMouseDown={(e) => !isResizing && handleMouseDown(e, "restroom", restroom.id)}
                onClick={() => setSelectedItem({ type: "restroom", id: restroom.id })}
                title={`${t[lang].restroom} ${restroom.id}`}
              >
                <span className="element-label">WC</span>
                {isSelected && (
                  <>
                    <div 
                      className="rotation-handle"
                      onMouseDown={(e) => handleRotationMouseDown(e, "restroom", restroom.id)}
                    />
                    <div 
                      className="resize-handle"
                      onMouseDown={(e) => handleResizeMouseDown(e, "restroom", restroom.id)}
                    />
                  </>
                )}
              </div>
            );
          })}

          {/* Windows */}
          {(positions.windows || []).map((window, idx) => (
            <div
              key={idx}
              className={`window-indicator ${
                draggedItem?.id === idx && draggedItem?.type === "window" ? "dragging-active" : ""
              }`}
              style={window}
              onMouseDown={(e) => handleMouseDown(e, "window", idx)}
            >
            </div>
          ))}

          {/* Tables */}
          {(tables || []).map((table) => {
            const tableId = table.id;
            const capacity = table.capacity;
            const position = (positions.tables && positions.tables[tableId]) || {
              top: "20%",
              left: "10%",
            };
            const size = getTableSize(capacity);
            const isDragging = draggedItem?.id === tableId && draggedItem?.type === "table";
            const isSelected = selectedItem?.type === "table" && selectedItem?.id === tableId;

            return (
              <div
                key={tableId}
                className={`floor-table ${size} ${
                  capacity === 2 ? "rectangular" : ""
                } ${
                  isDragging ? "dragging-active" : ""
                } ${isSelected ? "selected" : ""}`}
                style={{
                  ...position,
                  ...(getRotation("table", tableId) !== 0 && { transform: `rotate(${getRotation("table", tableId)}deg)` })
                }}
                onMouseDown={(e) => handleMouseDown(e, "table", tableId)}
                onClick={() => setSelectedItem({ type: "table", id: tableId })}
                title={`${t[lang].table} ${tableId} - ${capacity} ${t[lang].seats}`}
              >
                {/* Render chairs */}
                {[...Array(capacity)].map((_, i) => {
                  if (capacity === 2) {
                    const x = 0;
                    const y = i === 0 ? -26 : 26;
                    return (
                      <div
                        key={i}
                        className="table-chair"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                        }}
                      />
                    );
                  }

                  const angle = (360 / capacity) * i;
                  const radius =
                    size === "tiny"
                      ? 24
                      : size === "small"
                      ? 30
                      : size === "medium"
                      ? 36
                      : size === "large"
                      ? 42
                      : 50;
                  const x = Math.cos(((angle - 90) * Math.PI) / 180) * radius;
                  const y = Math.sin(((angle - 90) * Math.PI) / 180) * radius;

                  return (
                    <div
                      key={i}
                      className="table-chair"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                      }}
                    />
                  );
                })}

                <div 
                  className="table-number"
                  style={{
                    transform: `rotate(${-getRotation("table", tableId)}deg)`
                  }}
                >
                  {tableId}
                </div>
                <div 
                  className="table-capacity"
                  style={{
                    transform: `rotate(${-getRotation("table", tableId)}deg)`
                  }}
                >
                  {capacity}
                </div>
                {isSelected && (
                  <div 
                    className="rotation-handle"
                    onMouseDown={(e) => handleRotationMouseDown(e, "table", tableId)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
