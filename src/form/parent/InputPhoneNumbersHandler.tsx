import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {fieldAppearance} from "@/components/fieldAppearance";
import {PlusSquare, XSquare} from "lucide-react";

interface InputHandlerProps {
    value?: string[];
    onChange: (newValue: String[]) => void
}

export function InputPhoneNumbersHandler({value, onChange}: InputHandlerProps) {
    const [phoneNumbers, setPhoneNumbers] = useState(value || ['']);

    const handlePhoneNumberChange = (index: number, newValue: string) => {
        const newPhoneNumbers = [...phoneNumbers];
        newPhoneNumbers[index] = newValue;
        setPhoneNumbers(newPhoneNumbers);
        onChange(newPhoneNumbers.filter(Boolean));
    };

    const addPhoneNumberField = () => {
        setPhoneNumbers([...phoneNumbers, '']);
    };
    const removePhoneNumberField = (indexToRemove: number) => {
        if (indexToRemove !== 0) {
            const newPhoneNumbers = phoneNumbers.filter((_, index) => index !== indexToRemove);
            setPhoneNumbers(newPhoneNumbers);
            onChange(newPhoneNumbers.filter(Boolean));
        }
    };

    return (
        <>
            {phoneNumbers.map((phoneNumber, index) => (
                <div key={index} style={{display: 'flex', alignItems: 'center'}}>
                    <Input
                        placeholder={index === 0 ? "Mandatory Phone number" : "Optional Phone number"}
                        value={phoneNumber}
                        onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                    />
                    {index !== 0 && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removePhoneNumberField(index)}
                            style={{marginLeft: '8px'}}
                        >
                            <XSquare/>
                        </Button>
                    )}
                </div>
            ))}
            <Button
                className={fieldAppearance + "text-left"}
                type={"button"}
                variant={"ghost"}
                onClick={addPhoneNumberField}
            >
                <PlusSquare/>
                Add additional phone numbers
            </Button>
        </>
    );
}
