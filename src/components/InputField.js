export const InputField = ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    textarea = false,
    readOnly = false,
    error,
    ...props
  }) => (
    <div className="flex flex-col">
      <label className="font-medium text-gray-700">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input-field border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md`}
          readOnly={readOnly}
          {...props}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input-field border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md`}
          readOnly={readOnly}
          {...props}
        />
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );