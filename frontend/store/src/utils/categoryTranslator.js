const translationMap = {
  "إلكترونيات": "Electronics",
  "كاميرات": "Cameras",
  "سماعات": "Headphones",
  "إكسسوارات": "Accessories",
  "لابتوبات": "Laptops",
  "أزياء وأحذية": "Fashion & Shoes",
  "تجميل وصحة": "Beauty & Health",
  "رياضة": "Sports",
  "كتب": "Books",
  "منزل وحديقة": "Home & Garden",
  "ألعاب": "Toys & Games",
  "طعام": "Food",
  "رحلات": "Travel"
};

export const translateCategoryToEnglish = (cat) => {
  if (!cat) return "";
  return translationMap[cat] || cat;
};

export const translateCategoryToArabic = (cat) => {
  if (!cat) return "";
  const entry = Object.entries(translationMap).find(([ar, en]) => en.toLowerCase() === cat.toLowerCase());
  return entry ? entry[0] : cat;
};
