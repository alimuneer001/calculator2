// A reusable form input used by the Login and Signup pages.
// It shows a label, the input, and a validation error message.
// Works directly with Formik's field props.

export default function TextField({ label, name, type = "text", formik, ...rest }) {
  const error = formik.touched[name] && formik.errors[name];

  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-full rounded border p-2 text-gray-900"
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
