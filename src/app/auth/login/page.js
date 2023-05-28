"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const FILE_SIZE = 1024 * 1024 * 5; // 5MB and define size image 
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

// validationSchema 
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Required 🫠"),
  price: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  file: Yup.mixed()
    .test("fileSize", "File too large", (value) => {
      console.log("value", value);
      if (!value) {
        return true;
      }
      return value.size <= FILE_SIZE;
    })
    .test("fileFormat", "Unsupported Format", (value) => {
      if (!value) {
        return true;
      }
      return SUPPORTED_FORMATS.includes(value.type);
    })
    .required("Required"),
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  
  // handle submit to send data to the server
  const sendToServer = async (values) => {
    setIsLoading(true);
    let { title, price, description, avatar, role } = values;
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      title,
      price,
      description,
      avatar,
      role,
    });

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    fetch("https://api.escuelajs.co/api/v1/products", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setIsLoading(false);
        alert("Product created successfully");
        console.log(result);
      })
      .catch((error) => {
        setIsLoading(false);
        alert(error.message);
      });
  };
  // this use for upload image
  const uploadImage = async (values) => {  
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://api.escuelajs.co/api/v1/files/upload",
        values.file
      );
      console.log(response);
      setIsLoading(false);
      return response.data.location;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg">
      <Formik
        initialValues={{
          title: "",
          price: "",
          description: "",
          file: null,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const formData = new FormData();
          formData.append("file", values.file);

          const avatar = await uploadImage({ file: formData });
          console.log("avatar", avatar);

          values.avatar = avatar;
          setTimeout(() => {
            sendToServer(values);
            setSubmitting(false);
          }, 500);
        }}>
        {({ isSubmitting, setFieldValue }) => (
          <Form className="flex flex-col items-center justify-center bg-slate-100 rounded-lg">
            <h1 className="text-3xl font-bold mb-5 text-blue-500">Upload Product</h1>
            <div className="flex flex-col mb-5">
              <label htmlFor="name" className="mb-1 text-blue-500">
                Title
              </label>
              <Field
                type="text"
                name="name"
                id="name"
                className="border border-blue-500 rounded px-4 py-2"/>
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="flex flex-col mb-5">
              <label htmlFor="email" className="mb-1 text-blue-500">
                Price
              </label>
              <Field
                type="text"
                name="price"
                id="price"
                className="border border-blue-500 rounded px-4 py-2"/>
              <ErrorMessage
                name="price"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="flex flex-col mb-5">
              <label htmlFor="description" className="mb-1 text-blue-500">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                id="description"
                className="border border-blue-500 rounded px-5 py-3"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="flex flex-col mb-5">
              <label htmlFor="file" className="mb-1 text-blue-500">
                Avatar
              </label>
              <Field
                type="file"
                name="file"
                id="file"
                setFieldValue={setFieldValue}
                component={FileUpload}
                className="border border-blue-500 rounded px-4 py-2 text-blue-500"
              />
              <ErrorMessage
                name="file"
                component="div"
                className="text-red-500"
              />
            </div>
            <button
                disabled={isSubmitting}
                type="submit"
                className={`${isSubmitting
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700"
                  } text-white font-bold py-2 px-4 rounded`}>
                Upload
              </button>
          </Form>
        )}
      </Formik>
    </main>
  );
}

function FileUpload({ field, form, setFieldValue }) {
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (event) => {
    const file = event.currentTarget.files[0];
    form.setFieldValue(field.name, file);
    setPreviewImage(URL.createObjectURL(file));
  };

  return (
    <>
      <input
        type="file"
        onChange={handleChange}
        className="border border-gray-500 rounded px-4 py-2 text-black"
      />
      {previewImage && (
        <img src={previewImage} alt="preview" className="mt-4 h-20 w-20" />
      )}
    </>
  );
}

