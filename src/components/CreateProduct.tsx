import { ReactNode, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";

function CreateProduct(): ReactNode {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(0);

  if (user?.role !== "ROLE_ADMIN") {
    alert("You need ADMIN privileges to access create product page");
    navigate("/");
  }

  return <div></div>;
}

export default CreateProduct;
