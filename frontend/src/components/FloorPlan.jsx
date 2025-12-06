import React, { useState, useEffect } from "react";
import "./FloorPlan.css";
import { getFloorPlanLayout } from "../api";

export default function FloorPlan({ tables = [], bookings = [], lang = "en" }) {
  const [positions, setPositions] = useState(null);
  const [sizes, setSizes] = useState({});
  const [rotations, setRotations] = useState({});

  // Load saved positions on mount and when tables change
  useEffect(() => {
    loadPositions();
  }, [tables]);

  const loadPositions = async () => {
    try {
      const res = await getFloorPlanLayout();
      console.log("Loaded floor plan positions:", res.data);
      if (res.data && Object.keys(res.data).length > 0) {
        const loadedData = { ...res.data };
        
        // Always remove old restroom data from elements
        if (loadedData.elements) {
          const { restroom1, restroom2, ...otherElements } = loadedData.elements;
          loadedData.elements = otherElements;
        }
        
        // Ensure restrooms array exists
        if (!loadedData.restrooms || loadedData.restrooms.length === 0) {
          loadedData.restrooms = [
            { id: "wc1", top: "2%", left: "92%" },
            { id: "wc2", top: "2%", left: "86%" },
          ];
        }
        
        // Load sizes and rotations
        if (loadedData.sizes) {
          setSizes(loadedData.sizes);
        }
        if (loadedData.rotations) {
          setRotations(loadedData.rotations);
        }
        
        setPositions(loadedData);
      }
    } catch (err) {
      console.log("No saved layout, using default");
    }
  };
  
  // Helper functions for sizes and rotations
  const getSize = (type, id) => {
    const key = `${type}-${id}`;
    return sizes[key] || {};
  };
  
  const getRotation = (type, id) => {
    const key = `${type}-${id}`;
    return rotations[key] || 0;
  };

  const t = {
    en: {
      title: "Restaurant Floor Plan",
      entrance: "Entrance",
      counter: "Counter",
      kitchen: "Kitchen",
      window: "Window",
      restroom: "Restroom",
      table: "Table",
      available: "Available",
      occupied: "Occupied",
      seats: "seats",
    },
    zh: {
      title: "餐厅平面图",
      entrance: "入口",
      counter: "柜台",
      kitchen: "厨房",
      window: "窗户",
      restroom: "洗手间",
      table: "餐桌",
      available: "可用",
      occupied: "已占用",
      seats: "座位",
    },
  };

  // Check if table is currently occupied
  const isTableOccupied = (tableId) => {
    return bookings.some((b) => Number(b.table) === tableId);
  };

  // Get table capacity
  const getCapacity = (table) => {
    return typeof table === "object" ? table.capacity : 4;
  };

  const getTableId = (table) => {
    return typeof table === "object" ? table.id : table;
  };

  // Define table positions - realistic restaurant layout
  const getTablePosition = (tableId, capacity) => {
    // If custom positions exist, use them
    if (positions && positions.tables && positions.tables[tableId]) {
      return {
        ...positions.tables[tableId],
        size: capacity >= 10 ? "xlarge" : capacity >= 6 ? "large" : capacity >= 4 ? "medium" : capacity >= 2 ? "small" : "tiny",
      };
    }

    // Professional restaurant layout with proper spacing and logical arrangement
    const defaultPositions = {
      // Window side - 2-seater tables along left wall
      1: { top: "20%", left: "10%", size: "small" },
      2: { top: "42%", left: "10%", size: "small" },
      
      // Center left section - 4-seater tables
      3: { top: "20%", left: "28%", size: "medium" },
      4: { top: "20%", left: "46%", size: "medium" },
      6: { top: "50%", left: "28%", size: "medium" },
      7: { top: "50%", left: "46%", size: "medium" },
      
      // Right side - 6-seater tables
      5: { top: "22%", left: "68%", size: "large" },
      11: { top: "50%", left: "68%", size: "large" },
      
      // Bar seating near wall (1-seater)
      8: { top: "16%", left: "87%", size: "tiny" },
      9: { top: "32%", left: "87%", size: "tiny" },
      
      // Back section - large party tables
      10: { top: "75%", left: "30%", size: "xlarge" },    // 16-seater
      12: { top: "75%", left: "53%", size: "large" },     // 5-seater
      13: { top: "75%", left: "72%", size: "xlarge" },    // 10-seater
    };

    // Default positioning for any additional tables - place them in a grid below existing tables
    const defaultPos = {
      top: `${85 + Math.floor((tableId - 14) / 3) * 12}%`,
      left: `${15 + ((tableId - 14) % 3) * 30}%`,
      size: capacity >= 10 ? "xlarge" : capacity >= 6 ? "large" : capacity >= 4 ? "medium" : capacity >= 2 ? "small" : "tiny",
    };

    return defaultPositions[tableId] || defaultPos;
  };

  // Get element positions
  const getElementPosition = (elementKey) => {
    if (positions && positions.elements && positions.elements[elementKey]) {
      return positions.elements[elementKey];
    }

    const defaults = {
      entrance: { bottom: "2%", left: "43%" },
      kitchen: { top: "2%", left: "3%", width: "140px", height: "80px" },
      counter: { bottom: "8%", left: "18%" },
      restroom1: { top: "2%", right: "3%" },
      restroom2: { top: "2%", right: "calc(3% + 55px)" },
    };

    return defaults[elementKey] || {};
  };

  // Get window positions
  const getWindows = () => {
    if (positions && positions.windows) {
      return positions.windows;
    }

    return [
      { top: "20%", left: "1%" },
      { top: "42%", left: "1%" },
      { top: "64%", left: "1%" },
    ];
  };

  // Get restrooms array
  const getRestrooms = () => {
    if (positions && positions.restrooms) {
      return positions.restrooms;
    }
    return [
      { id: "wc1", top: "2%", left: "92%" },
      { id: "wc2", top: "2%", left: "86%" },
    ];
  };

  return (
    <div className="floor-plan-container">
      <h3 className="floor-plan-title">{t[lang].title}</h3>

      <div className="floor-plan-map">
        {/* Entrance at bottom center */}
        <div 
          className="floor-element entrance" 
          style={{
            ...getElementPosition("entrance"),
            ...getSize("element", "entrance"),
            ...(getRotation("element", "entrance") !== 0 && { transform: `rotate(${getRotation("element", "entrance")}deg)` })
          }}
        >
          <span className="element-label">{t[lang].entrance}</span>
        </div>

        {/* Reception/Host Stand near entrance */}
        <div 
          className="floor-element counter" 
          style={{
            ...getElementPosition("counter"),
            ...getSize("element", "counter"),
            ...(getRotation("element", "counter") !== 0 && { transform: `rotate(${getRotation("element", "counter")}deg)` })
          }}
        >
          <span className="element-label">{t[lang].counter}</span>
        </div>

        {/* Kitchen at back left - larger rectangular area */}
        <div 
          className="floor-element kitchen" 
          style={{
            ...getElementPosition("kitchen"),
            ...getSize("element", "kitchen"),
            ...(getRotation("element", "kitchen") !== 0 && { transform: `rotate(${getRotation("element", "kitchen")}deg)` })
          }}
        >
          <span className="element-label">{t[lang].kitchen}</span>
        </div>

        {/* Restrooms */}
        {getRestrooms().map((restroom) => (
          <div 
            key={restroom.id}
            className="floor-element restroom" 
            style={{
              top: restroom.top,
              left: restroom.left,
              ...getSize("restroom", restroom.id),
              ...(getRotation("restroom", restroom.id) !== 0 && { transform: `rotate(${getRotation("restroom", restroom.id)}deg)` })
            }}
          >
            <span className="element-label">WC</span>
          </div>
        ))}

        {/* Window indicators along left wall */}
        {getWindows().map((window, idx) => (
          <div key={idx} className="window-indicator" style={window}></div>
        ))}

        {/* Tables */}
        {tables.map((table) => {
          const tableId = table.id;
          const capacity = table.capacity;
          const position = getTablePosition(tableId, capacity);

          return (
            <div
              key={tableId}
              className={`floor-table ${position.size} ${capacity === 2 ? 'rectangular' : ''}`}
              style={{
                top: position.top,
                left: position.left,
                ...(getRotation("table", tableId) !== 0 && { transform: `rotate(${getRotation("table", tableId)}deg)` })
              }}
              title={`${t[lang].table} ${tableId} - ${capacity} ${t[lang].seats}`}
            >
              {/* Render chairs around the table */}
              {[...Array(capacity)].map((_, i) => {
                // For 2-capacity tables (rectangular), place chairs on top and bottom
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
                
                // For other tables, arrange chairs in a circle
                const angle = (360 / capacity) * i;
                const radius = position.size === "tiny" ? 24 : 
                               position.size === "small" ? 30 : 
                               position.size === "medium" ? 36 : 
                               position.size === "large" ? 42 : 50;
                const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
                const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
                
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
            </div>
          );
        })};
      </div>
    </div>
  );
}
