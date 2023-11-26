import React from "react";
import { ICustomFieldType } from "../interface/common";
import { Field } from "react-final-form";
import { Form as BootstrapForm } from "react-bootstrap";
import { toCamelCase } from "../helpers/common";

interface IOption {
  label: string;
  value: string;
}

export interface ICustomField {
  name: string;
  label: string;
  required: boolean;
  type: ICustomFieldType;
  placeholder?: string;
  onChange?: any;
  options?: IOption[];
  error?: string;
  touched?: boolean;
}

export const CustomField = (props: ICustomField) => {
  const {
    name,
    label,
    required,
    type,
    placeholder,
    options,
    error,
    touched
  } = props;

  const showError = error && touched;
  const fieldName = toCamelCase(name);

  return (
    <div>
      <div className="input-group">
        {label && (
          <label className="input-label">
            {label}
            {required && <Asterisk />}
          </label>
        )}
        {(() => {
          switch (type) {
            case ICustomFieldType.text:
              return (
                <Field
                  className="basic-input text-input"
                  name={fieldName}
                  placeholder={placeholder}
                  component="input"
                />
              );

            case ICustomFieldType.password:
              return (
                <Field name={fieldName}>
                  {(props) => {
                    return (
                      <BootstrapForm.Control
                        className="basic-input text-input"
                        placeholder={placeholder}
                        type="password"
                        id="inputPassword5"
                        aria-describedby="passwordHelpBlock"
                        onChange={props.input.onChange}
                      />
                    );
                  }}
                </Field>
              );

            case ICustomFieldType.textarea:
              return (
                <Field name={fieldName}>
                  {(props) => {
                    return (
                      <BootstrapForm.Control
                        placeholder={placeholder}
                        className="basic-input textarea-input"
                        as="textarea"
                        rows={3}
                        onChange={props.input.onChange}
                      />
                    );
                  }}
                </Field>
              );

            case ICustomFieldType.dropdown:
              return options ? (
                <Field name={fieldName}>
                  {(props) => {
                    return (
                      <BootstrapForm.Select
                        className="basic-input"
                        aria-label="Default select example"
                        onChange={props.input.onChange}
                      >
                        <option className="input-placeholder">
                          {placeholder || "Select Option"}
                        </option>
                        {options
                          .filter((option) => option.label && option.value)
                          .map((option, index) => {
                            return (
                              <option key={index} value={option.value}>
                                {option.label}
                              </option>
                            );
                          })}
                      </BootstrapForm.Select>
                    );
                  }}
                </Field>
              ) : (
                <></>
              );

            case ICustomFieldType.radio:
              return options ? (
                <Field name={fieldName}>
                  {(props) => {
                    return options
                      .filter((option) => option.label && option.value)
                      .map((option, index) => {
                        return (
                          <BootstrapForm.Check
                            key={index}
                            type={type}
                            id={`${option.label}-${type}`}
                            label={option.label}
                            checked={props.input.value === option.value}
                            onChange={(e) => {
                              props.input.onChange(option.value);
                            }}
                          />
                        );
                      });
                  }}
                </Field>
              ) : (
                <></>
              );

            case ICustomFieldType.checkbox:
              return options ? (
                <Field name={fieldName}>
                  {(props) => {
                    return options
                      .filter((option) => option.label && option.value)
                      .map((option, index) => {
                        return (
                          <BootstrapForm.Check
                            key={index}
                            type={type}
                            id={`${option.label}-${type}`}
                            label={option.label}
                            checked={props.input.value.includes(option.value)}
                            onChange={(e) => {
                              if (props.input.value.includes(option.value)) {
                                props.input.onChange(
                                  props.input.value.filter(
                                    (value: any) => value !== option.value
                                  )
                                );
                              } else {
                                props.input.onChange([
                                  ...props.input.value,
                                  option.value
                                ]);
                              }
                            }}
                          />
                        );
                      });
                  }}
                </Field>
              ) : (
                <></>
              );

            default:
              return <></>;
          }
        })()}
        {showError && <small className="error-text">{error}</small>}
      </div>
    </div>
  );
};

const Asterisk = () => {
  return <span className="required-sign">*</span>;
};
