import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const API = `${API_BASE}/tables`;

// ⭐ 获取桌子列表
export const getTables = async () => {
  try {
    const res = await axios.get(API);
    return res.data;
  } catch (err) {
    console.error("Failed to load tables");
    return [];
  }
};

// ⭐ 添加桌子
export const addTable = async (num) => {
  try {
    const res = await axios.post(API, { number: num });
    return res.data;
  } catch (err) {
    console.error("Failed to add table");
  }
};

// ⭐ 删除桌子
export const deleteTable = async (num) => {
  try {
    const res = await axios.delete(`${API}/${num}`);
    return res.data;
  } catch (err) {
    console.error("Failed to delete table");
  }
};
