import React, { useRef } from "react";
import { Field, Form, FormSpy } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import { Form as BootstrapForm } from "react-bootstrap";
import { ICustomFieldType } from "../interface/common";
import "bootstrap/dist/css/bootstrap.min.css";
import { DeleteButton } from "./DeleteButton";

export const DynamicFormGenerator = (props: {
  formData: any;
  setFormData: any;
}) => {
  const { formData, setFormData } = props;
  const FieldTypes = [
    {
      label: "Text",
      value: ICustomFieldType.text
    },
    {
      label: "Textarea",
      value: ICustomFieldType.textarea
    },
    {
      label: "Password",
      value: ICustomFieldType.password
    },
    {
      label: "Dropdown",
      value: ICustomFieldType.dropdown
    },
    {
      label: "Radio",
      value: ICustomFieldType.radio
    },
    {
      label: "Checkbox",
      value: ICustomFieldType.checkbox
    }
  ];

  const optionsRequired = (type: ICustomFieldType) => {
    return [
      ICustomFieldType.dropdown,
      ICustomFieldType.checkbox,
      ICustomFieldType.radio
    ].includes(type);
  };

  const downloadJsonFile = (values: any) => {
    const jsonString = JSON.stringify(values, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleJsonUpload = (e: any) => {
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        setFormData((prev: any) => ({
          ...prev,
          fields: [...prev.fields, ...jsonData.fields]
        }));
      } catch (error) {
        console.error("Error parsing JSON file", error);
      }
    };

    const file: any = e.target.files[0];
    if (file) {
      fileReader.readAsText(file);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const triggerJsonImport = () => {
    inputRef.current && inputRef.current.click();
  };

  return (
    <div className="dynamic-form-generator">
      <input ref={inputRef} type="file" onChange={handleJsonUpload} hidden />
      <div className="input-group">
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={triggerJsonImport}
        >
          Import via JSON
        </button>
      </div>{" "}
      <Form
        onSubmit={() => {}}
        initialValues={formData}
        mutators={{
          ...arrayMutators
        }}
        render={({ form, handleSubmit, values, errors }) => {
          return (
            <form>
              <FormSpy
                subscription={{ valid: true, values: true }}
                onChange={(props: any) => {
                  console.log({ values: props.values });
                  setFormData(props.values);
                }}
              />
              <div className="input-group">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => downloadJsonFile(values)}
                >
                  Download JSON
                </button>
              </div>

              <FieldArray name="fields">
                {({ fields }) => (
                  <div>
                    {fields.map((name, index) => (
                      <div key={name} className="field-data">
                        <div className="field-index-btn">
                          <span>{index + 1}</span>
                        </div>

                        <div className="input-row">
                          <div className="input-group">
                            <label className="input-label">Name</label>
                            <Field
                              className="basic-input text-input"
                              name={`${name}.name`}
                              component="input"
                            />
                          </div>
                          <div className="input-group">
                            <label className="input-label">Type</label>
                            <Field name={`${name}.type`}>
                              {(props) => {
                                return (
                                  <BootstrapForm.Select
                                    className="basic-input"
                                    aria-label="Default select example"
                                    onChange={props.input.onChange}
                                    value={props.input.value}
                                  >
                                    <option>Select Field Type</option>
                                    {FieldTypes.map((field, index) => {
                                      return (
                                        <option key={index} value={field.value}>
                                          {field.label}
                                        </option>
                                      );
                                    })}
                                  </BootstrapForm.Select>
                                );
                              }}
                            </Field>
                          </div>
                        </div>

                        <div className="input-row">
                          <div className="input-group">
                            <label className="input-label">Label</label>
                            <Field
                              className="basic-input text-input"
                              name={`${name}.label`}
                              component="input"
                            />
                          </div>
                          <div className="input-group">
                            <label className="input-label">Placeholder</label>
                            <Field
                              className="basic-input text-input"
                              name={`${name}.placeholder`}
                              component="input"
                            />
                          </div>
                        </div>

                        {optionsRequired(values.fields[index].type) && (
                          <div className="dropdown-options">
                            <label
                              htmlFor=""
                              className="input-label options-label"
                            >
                              Options
                            </label>
                            <FieldArray name={`${name}.options`}>
                              {({ fields: options }: any) => {
                                console.log({ options });

                                return (
                                  <div>
                                    {options?.map(
                                      (option: any, optionIndex: number) => {
                                        return (
                                          <div
                                            key={optionIndex}
                                            className="input-row flex-end"
                                          >
                                            <div className="input-group">
                                              <label className="input-label">
                                                Label
                                              </label>
                                              <Field
                                                className="basic-input text-input"
                                                name={`${option}.label`}
                                                component="input"
                                              />
                                            </div>
                                            <div className="input-group">
                                              <label className="input-label">
                                                Value
                                              </label>
                                              <Field
                                                className="basic-input text-input"
                                                name={`${option}.value`}
                                                component="input"
                                              />
                                            </div>
                                            <div className="input-group">
                                              {optionIndex + 1 ===
                                              values.fields[index].options
                                                .length ? (
                                                <button
                                                  className="btn btn-success"
                                                  type="button"
                                                  onClick={() =>
                                                    options.push({
                                                      label: "",
                                                      value: ""
                                                    })
                                                  }
                                                >
                                                  Add
                                                </button>
                                              ) : (
                                                <button
                                                  className="btn delete-btn"
                                                  type="button"
                                                  onClick={() =>
                                                    options.remove(optionIndex)
                                                  }
                                                >
                                                  <DeleteButton />
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                );
                              }}
                            </FieldArray>
                          </div>
                        )}

                        <div className="input-group flexed">
                          <label className="input-label">Required</label>
                          <Field className="" name={`${name}.required`}>
                            {(props) => (
                              <BootstrapForm.Check
                                onChange={props.input.onChange}
                                checked={props.input.value}
                                type="switch"
                                id={`default-checkbox`}
                              />
                            )}
                          </Field>
                        </div>

                        <div className="remove-input-btn">
                          <button
                            className="btn delete-btn"
                            type="button"
                            onClick={() => fields.remove(index)}
                          >
                            <DeleteButton />
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="button-group">
                      <button
                        className="btn btn-success"
                        type="button"
                        onClick={() =>
                          fields.push({
                            name: "",
                            type: "",
                            options: [{ label: "", value: "" }]
                          })
                        }
                      >
                        Add Field
                      </button>
                    </div>
                  </div>
                )}
              </FieldArray>
            </form>
          );
        }}
      />
    </div>
  );
};
