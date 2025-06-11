import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { Category } from "../lib/types";
import categoryService from "../lib/category.service";
import productService from "../lib/product.service";

function CreateProduct(): ReactNode {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>();
  const [error, setError] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [productImage, setProductImage] = useState<File | null>(null);

  const [isCreatingNewCategory, setIsCreatingNewCategory] =
    useState<boolean>(false);
  const [newCategoryName, setIsNewCategoryName] = useState<string>("");
  const [newCategoryParentId, setNewCategoryParentId] = useState<number>(0);

  async function fetchCategories(): Promise<void> {
    const categoriesRes = await categoryService.getAllCategories();
    if (categoriesRes.isSuccess) {
      setCategories(categoriesRes.content);
      setError("");
    } else {
      setError(categoriesRes.errMessage);
    }
  }

  async function createNewCategory(): Promise<void> {
    if (!newCategoryName) {
      setError("Please provide a new category name");
    }

    const categoryResult = await categoryService.createCategory({
      name: newCategoryName,
      parentCategoryId: newCategoryParentId === 0 ? null : newCategoryParentId,
    });

    if (categoryResult.isSuccess) {
      setIsNewCategoryName("");
      setNewCategoryParentId(0);
      setIsCreatingNewCategory(false);
      setError("");
      setCategories([...categories!, categoryResult.content]);
    } else {
      setError(categoryResult.errMessage);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    if (!productImage) {
      setError("Please upload a product image");
      return;
    }

    if (price <= 0 || stockQuantity <= 0) {
      setError(
        "Please make sure that the price and stock quantity are both more then 0",
      );
      return;
    }

    await productService.createProduct(
      {
        name,
        description,
        price,
        stockQuantity,
        sellerId: user!.id,
        categoryId,
      },
      productImage,
    );
    setError("");
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  if (user?.role !== "ROLE_ADMIN") {
    navigate("/");
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="flex flex-col items-center justify-center text-center h-screen gap-3"
    >
      <h2 className="font-semibold text-xl mb-10">
        Fill this form to create a new product with you as the seller
      </h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Product name..."
        className="bg-gray-200 text-black p-2 w-full rounded-lg placeholder-gray-500 focus:outline-none"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        placeholder="Product description..."
        className="bg-gray-200 text-black p-2 w-full rounded-lg placeholder-gray-500 focus:outline-none"
      />

      <div className="flex flex-col w-full">
        <label className="font-medium self-start">Price</label>
        <input
          type="number"
          value={price}
          step="0.1"
          min="0"
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          className="bg-gray-200 p-2 rounded-lg text-black"
        />
      </div>

      <div className="flex flex-col w-full">
        <label className="font-medium self-start">Stock Quantity</label>
        <input
          type="number"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(Number(e.target.value))}
          min="0"
          required
          className="bg-gray-200 p-2 rounded-lg text-black"
        />
      </div>

      <div className="flex w-full">
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          required
          className="bg-gray-200 text-black p-2 w-full rounded-l-lg focus:outline-none"
        >
          <option value={0} disabled>
            Select a category
          </option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setIsCreatingNewCategory(true)}
          className="bg-secondary p-2 rounded-r-lg text-white transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md cursor-pointer"
        >
          Other
        </button>
      </div>

      {isCreatingNewCategory && (
        <div className="flex flex-col gap-2 items-center jusitify-center">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setIsNewCategoryName(e.target.value)}
            required
            placeholder="New category name..."
            className="bg-gray-200 text-black p-2 w-full rounded-lg placeholder-gray-500 focus:outline-none"
          />

          <div className="flex flex-col w-full">
            <label className="font-medium self-start">
              Parent Category (optional)
            </label>
            <select
              value={newCategoryParentId}
              onChange={(e) => setNewCategoryParentId(Number(e.target.value))}
              className="bg-gray-200 text-black p-2 w-full rounded-lg focus:outline-none"
            >
              <option value={0}>None</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => createNewCategory()}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md cursor-pointer"
          >
            Create New Category
          </button>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setProductImage(e.target.files?.[0] || null)
        }
        required
        className="w-full p-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
      />

      <button
        type="submit"
        className="mt-4 bg-primary text-white px-6 py-2 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md cursor-pointer"
      >
        Create Product
      </button>

      {error && <p className="text-secondary font-semibold mt-10">{error}</p>}
    </form>
  );
}

export default CreateProduct;
