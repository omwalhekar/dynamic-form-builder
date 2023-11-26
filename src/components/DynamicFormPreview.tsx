import React, { useContext, useState } from "react";
import { FormContext } from "../App";
import { Form, FormSpy } from "react-final-form";
import { CustomField, ICustomField } from "./CustomField";
import { isEmpty, startCase } from "lodash";
import { toCamelCase } from "../helpers/common";
import { ICustomFieldType } from "../interface/common";
import { Modal } from "react-bootstrap";

export const DynamicFormPreview = () => {
  const formData = useContext(FormContext);
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState<any>({});

  const validateField = (field: ICustomField) => {
    if (field.name && field.label && field.type) return true;
    return false;
  };

  const handleSubmit = (values: any) => {
    setFormValues(values);
    setIsOpen(true);
  };

  const handleValidation = (values: any) => {
    let errors: any = {};

    formData?.fields?.forEach((field: ICustomField) => {
      if (field.required && isEmpty(values[toCamelCase(field.name)])) {
        errors[toCamelCase(field.name)] = "Field Required";
      }
      if (
        field.type === ICustomFieldType.dropdown &&
        values[toCamelCase(field.name)] === field.placeholder
      ) {
        errors[toCamelCase(field.name)] = "Field Required";
      }
    });

    console.log({ errors });

    return errors;
  };

  return (
    <div className="preview-wrapper">
      <div className="preview-content">
        <Form
          onSubmit={handleSubmit}
          validate={handleValidation}
          render={({ form, handleSubmit, values, errors, touched }) => {
            return (
              <form onSubmit={handleSubmit}>
                <FormSpy
                  subscription={{ valid: true, values: true }}
                  onChange={(props: any) => {
                    console.log({ preview: props.values });
                    // setFormData(props.values);
                  }}
                />

                {formData?.fields?.map((field: ICustomField, index: number) => {
                  return validateField(field) ? (
                    <CustomField
                      key={index}
                      type={field.type}
                      name={field.name}
                      label={field.label}
                      required={field.required}
                      placeholder={field.placeholder}
                      options={field.options}
                      error={errors && errors[toCamelCase(field.name)]}
                      touched={touched && touched[toCamelCase(field.name)]}
                    />
                  ) : (
                    <></>
                  );
                })}

                <button
                  className="btn btn-success"
                  type="submit"
                  onSubmit={handleSubmit}
                >
                  Submit
                </button>
              </form>
            );
          }}
        />
      </div>

      <Modal
        show={isOpen}
        onHide={() => setIsOpen(false)}
        backdrop="static"
        keyboard={false}
        className="form-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Form Values</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-body">
            {Object.keys(formValues).map((formKey) => {
              return (
                <div className="form-item">
                  <span className="form-key">{startCase(formKey)}:</span>
                  <span className="form-value">
                    {Array.isArray(formValues[formKey as any]) ? (
                      <>
                        {formValues[formKey as any].map(
                          (value: any, index: number) => (
                            <span className="form-array-value" key={index}>
                              {value}
                            </span>
                          )
                        )}
                      </>
                    ) : (
                      formValues[formKey as any]
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
