import React, { useState } from "react";
import { SectionType } from "@prisma/client";
import SectionTypeForm from "./SectionTypeForm";
import { sectionSchemas } from "@/lib/validation/sectionSchemas";
import { Select } from "@/components/ui/select";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const CreateSectionForm = () => {
  const [selectedType, setSelectedType] = useState<SectionType | null>(null);

  const handleTypeSelect = (value: string) => {
    setSelectedType(value as SectionType);
  };

  const handleSubmit = (data: any) => {
    console.log("Submitted section content:", data);
    // TODO: Send to API or update global state
  };

  return (
    <div className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Select onValueChange={handleTypeSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select section type" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(sectionSchemas).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedType && (
        <div className="space-y-4">
          <SectionTypeForm type={selectedType} onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
};

export default CreateSectionForm;
