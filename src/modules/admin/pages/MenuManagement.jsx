import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  Tag,
  X,
  Image as ImageIcon,
  DollarSign,
  FileText,
  UtensilsCrossed,
  ArrowRight,
  Camera,
  Loader2
} from 'lucide-react';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import ConfirmModal from '../../../components/ConfirmModal';
import { fetchCategories as fetchGlobalCategories, addProduct, fetchProducts, updateProduct, deleteProduct } from '../../../features/productSlice';
import { addCategory, updateCategory, deleteCategory, clearAdminError } from '../redux/adminSlice';

const MenuManagement = () => {
  const dispatch = useDispatch();
  const { items: menuItems, categories, loading: productLoading } = useSelector((state) => state.products);
  const { loading: adminLoading, error } = useSelector((state) => state.admin);
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger'
  });
  
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null); // { id, name }
  
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    flavorProfile: '',
    dietaryTags: '',
    calories: '',
    protein: '',
    allergens: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = menuItems.filter(item => {
    const itemName = item.name.toLowerCase();
    const itemCategory = (typeof item.category === 'object' ? item.category?.name : (item.categoryId?.name || 'Uncategorized')).toLowerCase();
    const search = searchTerm.toLowerCase();
    
    const matchesSearch = itemName.includes(search) || itemCategory.includes(search);
    const matchesCategory = activeCategory === 'All' || 
      (typeof item.category === 'object' ? item.category?.name : (item.categoryId?.name || 'Uncategorized')) === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const loading = productLoading;

  const openEditProductModal = (product) => {
    setIsEditingProduct(true);
    setCurrentProductId(product._id);
    setProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: typeof product.category === 'object' ? product.category?._id : (product.categoryId?._id || ''),
      flavorProfile: product.flavorProfile || '',
      dietaryTags: product.dietaryTags || '',
      calories: product.nutrition?.calories || '',
      protein: product.nutrition?.protein || '',
      allergens: product.allergens || '',
      image: null
    });
    setImagePreview(getImageUrl(product.image));
    setShowProductModal(true);
  };

  const handleDeleteProduct = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Product?',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      onConfirm: async () => {
        await dispatch(deleteProduct(id));
      },
      type: 'danger'
    });
  };

  const handleDeleteCategory = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Category?',
      message: 'Are you sure you want to delete this category? All products in this category might be affected.',
      onConfirm: async () => {
        const result = await dispatch(deleteCategory(id));
        if (deleteCategory.fulfilled.match(result)) {
          dispatch(fetchGlobalCategories());
        }
      },
      type: 'danger'
    });
  };

  const handleEdit = openEditProductModal;
   const handleDelete = handleDeleteProduct;
 
   // Helper to format image URL
   const getImageUrl = (path) => {
     if (!path) return null;
     
     // Clean the path
     let cleanPath = path.trim().replace(/^`|`$/g, '');
     cleanPath = cleanPath.replace(/\\/g, '/');
     
     // Remove common prefixes if they exist
     cleanPath = cleanPath.replace(/^(public|src)\//, '');
     
     if (cleanPath.startsWith('http')) return cleanPath;
     
     // Get base URL
     let baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1/';
     baseUrl = baseUrl.replace(/\/api\/v1\/?$/, ''); 
     
     const finalBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
     const finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
     
     return `${finalBaseUrl}${finalPath}`;
   };
 
   useEffect(() => {
     dispatch(fetchGlobalCategories());
     dispatch(fetchProducts());
   }, [dispatch]);
 
   const handleProductInputChange = (e) => {
     const { name, value } = e.target;
     setProductData({ ...productData, [name]: value });
   };
 
   const handleProductFileChange = (e) => {
     const file = e.target.files[0];
     if (file) {
       setProductData({ ...productData, image: file });
       setImagePreview(URL.createObjectURL(file));
     }
   };
 
   const handleAddProduct = async (e) => {
     e.preventDefault();
     const formData = new FormData();
     formData.append('name', productData.name);
     formData.append('description', productData.description);
     formData.append('price', productData.price);
     formData.append('categoryId', productData.categoryId);
     formData.append('flavorProfile', productData.flavorProfile);
     formData.append('dietaryTags', productData.dietaryTags);
     formData.append('nutrition[calories]', productData.calories);
     formData.append('nutrition[protein]', productData.protein);
     formData.append('allergens', productData.allergens);
     
     if (productData.image) {
       formData.append('image', productData.image);
     }
 
     if (isEditingProduct) {
       const result = await dispatch(updateProduct({ id: currentProductId, productData: formData }));
       if (updateProduct.fulfilled.match(result)) {
         dispatch(fetchProducts()); 
         closeProductModal();
       }
     } else {
       const result = await dispatch(addProduct(formData));
       if (addProduct.fulfilled.match(result)) {
         dispatch(fetchProducts()); 
         closeProductModal();
       }
     }
   };
 
   const closeProductModal = () => {
     setShowProductModal(false);
     setIsEditingProduct(false);
     setCurrentProductId(null);
     setProductData({ 
       name: '', 
       description: '', 
       price: '', 
       categoryId: '', 
       flavorProfile: '',
       dietaryTags: '',
       calories: '',
       protein: '',
       allergens: '',
       image: null 
     });
     setImagePreview(null);
   };
 
   const handleAddCategory = async (e) => {
     e.preventDefault();
     if (!newCategory.trim()) return;
     
     const result = await dispatch(addCategory(newCategory));
     if (addCategory.fulfilled.match(result)) {
       setNewCategory('');
       dispatch(fetchGlobalCategories()); // Refresh global list
     }
   };
 
   const handleUpdateCategory = async (e) => {
     e.preventDefault();
     if (!editingCategory?.name.trim()) return;
 
     const result = await dispatch(updateCategory({ 
       id: editingCategory.id, 
       name: editingCategory.name 
     }));
     
     if (updateCategory.fulfilled.match(result)) {
       setEditingCategory(null);
       dispatch(fetchGlobalCategories()); // Refresh global list
       dispatch(fetchProducts()); // Refresh products to show updated category name
     }
   };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black dark:text-white tracking-tight">Menu Management</h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">Add, edit or remove food items from your menu.</p>
        </div>
        <div className="flex space-x-2 md:space-x-3 w-full sm:w-auto">
          <button 
            onClick={() => setShowCategoryModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 text-[10px] md:text-sm font-bold hover:bg-secondary-200 transition-all border border-secondary-200 dark:border-secondary-700 shadow-sm"
          >
            <Tag className="mr-1.5 md:mr-2 h-4 w-4 md:h-5 md:w-5" /> Categories
          </button>
          <Button 
            onClick={() => setShowProductModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center text-[10px] md:text-sm py-2.5 md:py-3 px-4 md:px-6 rounded-xl md:rounded-2xl"
          >
            <Plus className="mr-1.5 md:mr-2 h-4 w-4 md:h-5 md:w-5" /> New Item
          </Button>
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
          <div className="bg-white dark:bg-secondary-900 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-secondary-100 dark:border-secondary-800 animate-in fade-in zoom-in duration-200">
            {/* Modal Header - Fixed */}
            <div className="flex justify-between items-center p-10 pb-5 shrink-0">
              <h2 className="text-3xl font-black dark:text-white">{isEditingProduct ? 'Update Product' : 'Add New Product'}</h2>
              <button onClick={closeProductModal} className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full transition-colors">
                <X className="w-6 h-6 dark:text-white" />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-grow overflow-y-auto px-10 py-5 custom-scrollbar">
              <form id="productForm" onSubmit={handleAddProduct} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Product Name"
                    name="name"
                    placeholder="e.g. Double Cheese Burger"
                    value={productData.name}
                    onChange={handleProductInputChange}
                    icon={UtensilsCrossed}
                    required
                  />
                  <Input
                    label="Price (PKR)"
                    name="price"
                    type="number"
                    placeholder="e.g. 1500"
                    value={productData.price}
                    onChange={handleProductInputChange}
                    icon={DollarSign}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Category</label>
                    <select 
                      name="categoryId"
                      value={productData.categoryId}
                      onChange={handleProductInputChange}
                      className="w-full bg-slate-50 dark:bg-secondary-950 border-none rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-primary-500/20 text-sm font-medium dark:text-white transition-all shadow-sm"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Flavor Profile"
                    name="flavorProfile"
                    placeholder="e.g. Cheesy, Savory"
                    value={productData.flavorProfile}
                    onChange={handleProductInputChange}
                    icon={Tag}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Dietary Tags"
                    name="dietaryTags"
                    placeholder="e.g. Vegetarian, Gluten-Free"
                    value={productData.dietaryTags}
                    onChange={handleProductInputChange}
                    icon={Tag}
                  />
                  <Input
                    label="Allergens"
                    name="allergens"
                    placeholder="e.g. Dairy, Gluten"
                    value={productData.allergens}
                    onChange={handleProductInputChange}
                    icon={X}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Calories"
                    name="calories"
                    type="number"
                    placeholder="e.g. 600"
                    value={productData.calories}
                    onChange={handleProductInputChange}
                    icon={FileText}
                  />
                  <Input
                    label="Protein (g)"
                    name="protein"
                    type="number"
                    placeholder="e.g. 35"
                    value={productData.protein}
                    onChange={handleProductInputChange}
                    icon={FileText}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    placeholder="Describe the product..."
                    value={productData.description}
                    onChange={handleProductInputChange}
                    className="w-full bg-slate-50 dark:bg-secondary-950 border-none rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-primary-500/20 text-sm font-medium dark:text-white transition-all shadow-sm"
                    required
                  ></textarea>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Product Image</label>
                  <div 
                    onClick={() => document.getElementById('productImage').click()}
                    className="border-2 border-dashed border-secondary-200 dark:border-secondary-800 rounded-3xl p-8 text-center cursor-pointer hover:border-primary-500 transition-colors bg-slate-50/50 dark:bg-secondary-950/50"
                  >
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img src={imagePreview} alt="Preview" className="w-48 h-48 object-cover rounded-2xl shadow-lg" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                          <Camera className="text-white w-8 h-8" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto">
                          <ImageIcon className="text-primary-500 w-8 h-8" />
                        </div>
                        <p className="text-secondary-500 font-bold">Click to upload product image</p>
                        <p className="text-xs text-secondary-400">JPG, PNG or WEBP (Max 2MB)</p>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    id="productImage" 
                    className="hidden" 
                    onChange={handleProductFileChange}
                    accept="image/*"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="p-10 pt-5 shrink-0 border-t border-secondary-100 dark:border-secondary-800">
              <Button form="productForm" type="submit" loading={productLoading} className="w-full py-5 text-xl">
                {isEditingProduct ? 'Update Product' : 'Add Product'} <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-secondary-900 rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl border border-secondary-100 dark:border-secondary-800">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black dark:text-white">Categories</h2>
              <button onClick={() => setShowCategoryModal(false)} className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full transition-colors">
                <X className="w-6 h-6 dark:text-white" />
              </button>
            </div>

            <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl">
                  <p className="text-red-600 dark:text-red-400 text-sm font-bold">{error}</p>
                </div>
              )}
              
              <Input
                label={editingCategory ? "Edit Category Name" : "Category Name"}
                placeholder="e.g. Pizza, Burgers"
                value={editingCategory ? editingCategory.name : newCategory}
                onChange={(e) => editingCategory 
                  ? setEditingCategory({ ...editingCategory, name: e.target.value })
                  : setNewCategory(e.target.value)
                }
                icon={Tag}
                required
              />
              
              <div className="flex gap-3">
                {editingCategory && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setEditingCategory(null)}
                    className="flex-1 py-4"
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" loading={adminLoading} className="flex-[2] py-4">
                  {editingCategory ? "Update Category" : "Add Category"}
                </Button>
              </div>
            </form>

            <div className="mt-10 pt-8 border-t border-secondary-100 dark:border-secondary-800">
              <p className="text-xs font-black uppercase tracking-widest text-secondary-400 mb-4">Existing Categories</p>
              <div className="grid grid-cols-1 gap-2">
                {categories.map((cat) => (
                  <div key={cat._id} className="flex items-center justify-between p-3 rounded-xl bg-secondary-100 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                    <span className="text-secondary-700 dark:text-secondary-300 text-sm font-bold">
                      {cat.name}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => setEditingCategory({ id: cat._id, name: cat.name })}
                        className="p-2 hover:bg-secondary-200 dark:hover:bg-secondary-700 rounded-lg text-primary-500 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-secondary-900 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-secondary-100 dark:border-secondary-800 overflow-hidden transition-all duration-500">
        <div className="p-4 md:p-8 border-b border-secondary-100 dark:border-secondary-800 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 bg-slate-50/50 dark:bg-secondary-950/30">
          <div className="relative w-full md:w-96 group">
            <input
              type="text"
              placeholder="Search items by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-secondary-900 border-2 border-secondary-100 dark:border-secondary-800 rounded-xl md:rounded-2xl py-2.5 md:py-3.5 px-10 md:px-12 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-xs md:text-sm dark:text-white transition-all outline-none"
            />
            <Search className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <div className="flex items-center">
            <div className="text-[9px] md:text-sm font-black text-secondary-400 bg-white dark:bg-secondary-900 px-3 md:px-4 py-2 rounded-lg md:rounded-xl border border-secondary-100 dark:border-secondary-800 shadow-sm">
              TOTAL ITEMS: <span className="text-primary-500 ml-1">{filteredItems.length}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar md:custom-scrollbar">
          <div className="min-w-[800px] p-4 md:p-6">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 md:px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-400">
              <div className="col-span-5">Product Details</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="space-y-3 mt-2">
              {loading && menuItems.length === 0 ? (
                <div className="py-20 text-center">
                  <Loader2 className="h-10 w-10 md:h-12 md:w-12 text-primary-500 animate-spin mx-auto" />
                  <p className="mt-4 text-secondary-500 font-bold text-sm md:text-base">Loading menu items...</p>
                </div>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <div 
                    key={item._id} 
                    className={`grid grid-cols-12 gap-4 items-center px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 group hover:shadow-lg border border-transparent ${
                      index % 2 === 0 
                      ? 'bg-white dark:bg-secondary-900' 
                      : 'bg-gray-50/50 dark:bg-secondary-800/30'
                    } hover:border-primary-500/20`}
                  >
                    <div className="col-span-5">
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-secondary-100 dark:bg-secondary-800 overflow-hidden shadow-inner">
                          {item.image ? (
                            <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-secondary-300 italic text-[8px] md:text-[10px]">No Pic</div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold dark:text-white text-xs md:text-base leading-tight truncate">{item.name}</span>
                          <span className="text-[9px] md:text-xs font-bold text-primary-500 uppercase tracking-widest mt-0.5 truncate">{item.category?.name || 'Uncategorized'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 text-center">
                      <span className="font-bold text-secondary-900 dark:text-white text-xs md:text-base whitespace-nowrap">Rs. {item.price}</span>
                    </div>

                    <div className="col-span-2 text-center">
                      {item.isAvailable ? (
                        <span className="mx-auto px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-xs font-black uppercase tracking-wider bg-green-100 text-green-700 flex items-center justify-center w-fit shadow-sm">
                          Available
                        </span>
                      ) : (
                        <span className="mx-auto px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-xs font-black uppercase tracking-wider bg-red-100 text-red-700 flex items-center justify-center w-fit shadow-sm">
                          Sold Out
                        </span>
                      )}
                    </div>

                    <div className="col-span-3 text-right flex justify-end space-x-1.5 md:space-x-2">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-2 md:p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg md:rounded-xl text-secondary-400 hover:text-primary-500 hover:bg-primary-500/10 transition-all shadow-sm active:scale-90"
                      >
                        <Edit2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="p-2 md:p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg md:rounded-xl text-secondary-400 hover:text-red-500 hover:bg-red-500/10 transition-all shadow-sm active:scale-90"
                      >
                        <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 md:py-24 text-center space-y-4 md:space-y-6 bg-slate-50/50 dark:bg-secondary-950/20 rounded-3xl border-2 border-dashed border-secondary-100 dark:border-secondary-800">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-secondary-900 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
                    <Search className="h-8 w-8 md:h-10 md:w-10 text-secondary-300" />
                  </div>
                  <div className="max-w-xs mx-auto">
                    <p className="text-secondary-900 dark:text-white font-black text-lg md:text-xl">No items found</p>
                    <p className="text-xs text-secondary-500 font-bold mt-2 uppercase tracking-widest leading-relaxed">Try adjusting your search or category</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />
    </div>
  );
};

export default MenuManagement;
