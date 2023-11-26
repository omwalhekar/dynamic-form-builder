import React, { createContext, useState } from "react";
import "./styles/app.scss";
import { DynamicFormGenerator } from "./components/DynamicFormGenerator";
import { DynamicFormPreview } from "./components/DynamicFormPreview";
import { ICustomFieldType } from "./interface/common";

export const FormContext = createContext<any>(null);

function App() {
  const [formData, setFormData] = useState({
    fields: [
      {
        name: "First Name",
        label: "First Name",
        placeholder: "Enter First Name",
        type: ICustomFieldType.text,
        options: [{ label: "", value: "" }]
      }
    ]
  });

  return (
    <div className="container">
      <FormContext.Provider value={formData}>
        <div className="app-wrapper custom-form-layout">
          <DynamicFormGenerator formData={formData} setFormData={setFormData} />
          <DynamicFormPreview />
        </div>
      </FormContext.Provider>
    </div>
  );
}

export default App;
