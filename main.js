import { sortItem, searchItems, paginate } from "./index.js";
// INITIAL DATA
const defaultProducts = [
    { id: 1, name: "Laptop", price: 8000 },
    { id: 2, name: "Mobile", price: 5000 },
    { id: 3, name: "Tablet", price: 9500 },
    { id: 4, name: "Monitor", price: 12000 },
    { id: 5, name: "Keyboard", price: 1500 },
    { id: 6, name: "Mouse", price: 800 },
    { id: 7, name: "Headphones", price: 2500 },
    { id: 8, name: "Smart Watch", price: 4500 }
];
// LOCAL STORAGE
const STORAGE_KEY = "product-management-products";
function loadProducts() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved)
            return [...defaultProducts];
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) &&
            parsed.every((item) => typeof item === "object" &&
                item !== null &&
                "id" in item &&
                typeof item.id === "number" &&
                "name" in item &&
                typeof item.name === "string" &&
                "price" in item &&
                typeof item.price === "number")) {
            return parsed;
        }
    }
    catch {
        console.warn("Could not load saved products.");
    }
    return [...defaultProducts];
}
let products = loadProducts();
function saveProducts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}
// DOM ELEMENTS
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const productForm = document.getElementById("productForm");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productTable = document.getElementById("productTable");
const productCount = document.getElementById("productCount");
const pageInfo = document.getElementById("pageInfo");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
// APPLICATION STATE
let currentPage = 1;
const pageSize = 5;
// MAIN RENDER FUNCTION
function renderProducts() {
    // STEP 1: SEARCH
    const searchedProducts = searchItems(products, searchInput.value, "name");
    // STEP 2: SORT
    const [sortKey, order] = sortSelect.value.split("-");
    const sortedProducts = sortItem(searchedProducts, sortKey, order);
    // STEP 3: PAGINATION
    const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);
    const visibleProducts = paginate(sortedProducts, currentPage, pageSize);
    // STEP 4: UPDATE TABLE
    productTable.replaceChildren();
    if (visibleProducts.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 4;
        cell.textContent = "No products found.";
        row.appendChild(cell);
        productTable.appendChild(row);
    }
    visibleProducts.forEach(product => {
        const row = document.createElement("tr");
        const idCell = document.createElement("td");
        idCell.textContent = String(product.id);
        const nameCell = document.createElement("td");
        nameCell.textContent = product.name;
        const priceCell = document.createElement("td");
        priceCell.textContent = `₹${product.price.toLocaleString("en-IN")}`;
        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.dataset.id = String(product.id);
        actionCell.appendChild(deleteButton);
        row.append(idCell, nameCell, priceCell, actionCell);
        productTable.appendChild(row);
    });
    // STEP 5: UPDATE PAGINATION
    productCount.textContent =
        `${searchedProducts.length} products found`;
    pageInfo.textContent =
        `Page ${currentPage} of ${totalPages}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}
// SEARCH EVENT
searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderProducts();
});
// SORT EVENT
sortSelect.addEventListener("change", () => {
    currentPage = 1;
    renderProducts();
});
// ADD PRODUCT EVENT
productForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = productName.value.trim();
    const price = Number(productPrice.value);
    if (!name || !Number.isFinite(price) || price <= 0) {
        alert("Enter a valid product name and price.");
        return;
    }
    const newProduct = {
        id: Math.max(0, ...products.map(p => p.id)) + 1,
        name,
        price
    };
    products.push(newProduct);
    saveProducts();
    productForm.reset();
    searchInput.value = "";
    currentPage = 1;
    renderProducts();
});
// DELETE PRODUCT EVENT
productTable.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof HTMLElement))
        return;
    const button = target.closest(".delete-btn");
    if (!button)
        return;
    const id = Number(button.dataset.id);
    products = products.filter(product => product.id !== id);
    saveProducts();
    renderProducts();
});
// PREVIOUS PAGE
prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderProducts();
    }
});
// NEXT PAGE
nextButton.addEventListener("click", () => {
    currentPage++;
    renderProducts();
});
// INITIAL RENDER
renderProducts();
//# sourceMappingURL=main.js.map