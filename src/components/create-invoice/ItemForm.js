import { InputField } from "../InputField";
import { FaTimes } from "react-icons/fa";

export const ItemForm = ({
    item,
    index,
    handleItemChange,
    removeItem,
    errorMessages,
  }) => {
    return (
      <div className="grid custom-grid-4 gap-2">
        <InputField
          label="Name"
          value={item.name}
          onChange={(e) => handleItemChange(index, "name", e.target.value)}
          placeholder="Item Name"
          textarea
          error={errorMessages?.items?.[index]?.name}
        />
        <InputField
          label="Quantity"
          value={item.quantity}
          onChange={(e) =>
            handleItemChange(index, "quantity", parseInt(e.target.value) || 0)
          }
          type="number"
          placeholder="Quantity"
          error={errorMessages?.items?.[index]?.quantity}
          style={{ width: "90px" }}
        />
        <InputField
          label="Rate"
          value={item.rate}
          onChange={(e) =>
            handleItemChange(index, "rate", parseFloat(e.target.value) || 0)
          }
          type="number"
          placeholder="Rate"
          error={errorMessages?.items?.[index]?.rate}
          style={{ width: "90px" }}
        />
        <InputField
          label="Amount"
          value={item.quantity * item.rate}
          readOnly
          placeholder="Amount"
        />
  
        {index > 0 && (
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="text-red-600 text-xs mt-2 inline-flex items-center gap-1"
          >
            <FaTimes />
            Remove Item
          </button>
        )}
      </div>
    );
  };