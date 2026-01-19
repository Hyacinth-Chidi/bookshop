"use client";

import { useState, useEffect, useRef } from "react";
import imageCompression from "browser-image-compression";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import Select from "@/components/shared/Select";
import { Upload, X, Camera, Image as FolderOpen, Loader2 } from "lucide-react";
import { getFaculties, getSystemSettings } from "@/lib/settingsApi";
import { toast } from "react-hot-toast";

// Image Upload Component with Camera/File options
function ImageUploader({
  label,
  required,
  preview,
  onFileChange,
  onRemove,
  fieldName,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleOptionClick = (type) => {
    setShowOptions(false);
    if (type === "camera") {
      cameraInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file, fieldName);
    }
    // Reset input so the same file can be selected again
    e.target.value = "";
  };

  return (
    <div>
      <label className="block text-xs sm:text-sm font-medium text-neutral-900 mb-1.5 sm:mb-2">
        {label} {required && <span className="text-error">*</span>}
      </label>

      {preview === "loading" ? (
        <div className="flex flex-col items-center justify-center w-full h-32 sm:h-48 border-2 border-dashed border-primary/50 rounded-lg bg-primary/5">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-spin mb-2" />
          <span className="text-xs sm:text-sm text-primary font-medium">
            Optimizing image...
          </span>
        </div>
      ) : preview ? (
        <div className="relative">
          <img
            src={preview}
            alt={label}
            className="w-full h-32 sm:h-48 object-contain bg-neutral-100 rounded-lg"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 bg-error text-white rounded-full hover:bg-error/90"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowOptions(true)}
            className="flex flex-col items-center justify-center w-full h-32 sm:h-48 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50 hover:border-primary/50 transition-colors"
          >
            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-400 mb-1 sm:mb-2" />
            <span className="text-xs sm:text-sm text-neutral-500">
              Tap to upload
            </span>
          </button>

          {/* Options Modal */}
          {showOptions && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={() => setShowOptions(false)}
              />

              {/* Options Panel */}
              <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 pb-8 z-50 animate-slide-up sm:animate-none sm:fixed sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[320px] sm:rounded-xl sm:shadow-2xl sm:p-6">
                <div className="w-12 h-1 bg-neutral-300 rounded-full mx-auto mb-4 sm:hidden" />
                <p className="text-sm font-semibold text-neutral-900 mb-3 text-center sm:text-left">
                  Choose source
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleOptionClick("camera")}
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Camera className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-neutral-900">
                        Take Photo
                      </p>
                      <p className="text-xs text-neutral-500">
                        Use your camera
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOptionClick("file")}
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-info" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-neutral-900">
                        Choose from Files
                      </p>
                      <p className="text-xs text-neutral-500">
                        Upload from gallery or files
                      </p>
                    </div>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowOptions(false)}
                  className="w-full mt-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors sm:hidden"
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

export default function BookForm({
  initialData = null,
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    courseCode: initialData?.courseCode || "",
    courseLecturer: initialData?.courseLecturer || "",
    departmentId: initialData?.departmentId || "",
    facultyId: initialData?.facultyId || "",
    level: initialData?.level || "",
    semester: initialData?.semester || "",
    session: initialData?.session || "",
    hasManual: initialData?.hasManual || false,
    manualPrice: initialData?.manualPrice || "",
    quantity: initialData?.quantity || 0,
  });

  const [files, setFiles] = useState({
    frontCover: null,
    backCover: null,
    manualFrontCover: null,
  });

  const [previews, setPreviews] = useState({
    frontCover: initialData?.frontCover || null,
    backCover: initialData?.backCover || null,
    manualFrontCover: initialData?.manualFrontCover || null,
  });

  const [faculties, setFaculties] = useState([]);
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [facultiesRes, settingsRes] = await Promise.all([
          getFaculties(),
          !initialData
            ? getSystemSettings()
            : Promise.resolve({ success: false }),
        ]);

        if (facultiesRes.success) {
          setFaculties(facultiesRes.data);

          if (initialData?.facultyId) {
            const selectedFaculty = facultiesRes.data.find(
              (f) => f.id === initialData.facultyId
            );
            if (selectedFaculty) {
              setAvailableDepartments(selectedFaculty.departments || []);
            }
          }
        }

        if (!initialData && settingsRes.success && settingsRes.data) {
          setFormData((prev) => ({
            ...prev,
            session: settingsRes.data.currentSession,
            semester: settingsRes.data.currentSemester,
          }));
        }
      } catch (error) {
        console.error("Error loading form data:", error);
        toast.error("Failed to load some form data");
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "facultyId") {
      const selectedFaculty = faculties.find((f) => f.id === value);
      setAvailableDepartments(selectedFaculty?.departments || []);
      setFormData({
        ...formData,
        facultyId: value,
        departmentId: "",
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = async (file, fieldName) => {
    try {
      // Show loading state
      setPreviews({ ...previews, [fieldName]: "loading" });

      // Compression options
      const options = {
        maxSizeMB: 1, // Max file size 1MB
        maxWidthOrHeight: 1200, // Max dimension 1200px
        useWebWorker: true, // Use web worker for better performance
        fileType: "image/jpeg", // Convert to JPEG
      };

      // Compress the image
      const compressedFile = await imageCompression(file, options);

      // Log compression results for debugging
      console.log(
        `Original: ${(file.size / 1024 / 1024).toFixed(2)}MB -> Compressed: ${(
          compressedFile.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );

      setFiles({ ...files, [fieldName]: compressedFile });
      setPreviews({
        ...previews,
        [fieldName]: URL.createObjectURL(compressedFile),
      });
    } catch (error) {
      console.error("Image compression error:", error);
      toast.error("Failed to process image. Please try again.");
      setPreviews({ ...previews, [fieldName]: null });
    }
  };

  const removeFile = (fieldName) => {
    setFiles({ ...files, [fieldName]: null });
    setPreviews({ ...previews, [fieldName]: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== "" && formData[key] !== null) {
        submitData.append(key, formData[key]);
      }
    });

    if (files.frontCover) submitData.append("frontCover", files.frontCover);
    if (files.backCover) submitData.append("backCover", files.backCover);
    if (files.manualFrontCover)
      submitData.append("manualFrontCover", files.manualFrontCover);

    onSubmit(submitData);
  };

  // Convert data to Select options format
  const facultyOptions = faculties.map((f) => ({ value: f.id, label: f.name }));
  const departmentOptions = availableDepartments.map((d) => ({
    value: d.id,
    label: d.name,
  }));
  const levelOptions = [
    { value: "100 Level", label: "100 Level" },
    { value: "200 Level", label: "200 Level" },
    { value: "300 Level", label: "300 Level" },
    { value: "400 Level", label: "400 Level" },
    { value: "500 Level", label: "500 Level" },
  ];
  const semesterOptions = [
    { value: "First Semester", label: "First Semester" },
    { value: "Second Semester", label: "Second Semester" },
  ];

  if (loadingData) {
    return (
      <div className="p-4 sm:p-8 text-center text-gray-500 text-sm">
        Loading form data...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Input
            label="Book Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Introduction to Computer Science"
          />
          <Input
            label="Course Code"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            required
            placeholder="e.g., CSC 201"
          />
          <Input
            label="Course Lecturer (Optional)"
            name="courseLecturer"
            value={formData.courseLecturer}
            onChange={handleChange}
            placeholder="e.g., Dr. John Doe"
          />
          <Input
            label="Quantity"
            name="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            required
            placeholder="e.g., 50"
          />
        </div>
        <div className="mt-3 sm:mt-4">
          <label className="block text-sm font-medium text-neutral-900 mb-1.5 sm:mb-2">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={2}
            placeholder="Brief description of the book..."
            className="w-full px-3 sm:px-4 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">
          Pricing
        </h3>
        <div className="space-y-4">
          <Input
            label="Total Price (₦)"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="e.g., 3500 (incl. manual if any)"
          />
          
          <div className="pt-2 border-t border-neutral-100">
            <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="hasManual"
                checked={formData.hasManual}
                onChange={handleChange}
                className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-neutral-900">
                This book includes a manual
              </span>
            </label>

            {formData.hasManual && (
              <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200 space-y-2">
                <Input
                  label="Manual Portion (₦)"
                  name="manualPrice"
                  type="number"
                  step="0.01"
                  value={formData.manualPrice}
                  onChange={handleChange}
                  required={formData.hasManual}
                  placeholder="e.g., 1000"
                />
                <p className="text-xs text-neutral-500">
                  This helps students understand the price breakdown. The total price above should already include this.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Academic Details */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">
          Academic Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Select
            label="Faculty"
            name="facultyId"
            value={formData.facultyId}
            onChange={handleChange}
            options={facultyOptions}
            placeholder="Select Faculty"
            required
          />

          <Select
            label="Department"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            options={departmentOptions}
            placeholder="Select Department"
            disabled={!formData.facultyId}
            required
          />

          <Select
            label="Level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            options={levelOptions}
            placeholder="Select Level"
            required
          />

          <Select
            label="Semester"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            options={semesterOptions}
            placeholder="Select Semester"
            required
          />

          <Input
            label="Session"
            name="session"
            value={formData.session}
            onChange={handleChange}
            required
            placeholder="e.g., 2024/2025"
          />
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">
          Book Images
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <ImageUploader
            label="Front Cover"
            required={!initialData}
            preview={previews.frontCover}
            onFileChange={handleFileChange}
            onRemove={() => removeFile("frontCover")}
            fieldName="frontCover"
          />

          <ImageUploader
            label="Back Cover"
            required={false}
            preview={previews.backCover}
            onFileChange={handleFileChange}
            onRemove={() => removeFile("backCover")}
            fieldName="backCover"
          />

          {formData.hasManual && (
            <div className="col-span-2 sm:col-span-1">
              <ImageUploader
                label="Manual Cover"
                required={!initialData && formData.hasManual}
                preview={previews.manualFrontCover}
                onFileChange={handleFileChange}
                onRemove={() => removeFile("manualFrontCover")}
                fieldName="manualFrontCover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          className="w-full sm:w-auto"
          loading={loading}
          disabled={loading}
        >
          {initialData ? "Update Book" : "Create Book"}
        </Button>
      </div>
    </form>
  );
}
