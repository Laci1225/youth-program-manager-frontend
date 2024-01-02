"use client"

import {CommandGroup, CommandItem, CommandList, CommandInput} from "@/components/ui/command"
import {Command as CommandPrimitive} from "cmdk"
import React, {useState, useRef, useCallback, type KeyboardEvent, FormEvent, useEffect} from "react"

import {cn} from "@/lib/utils"
import {Check, XIcon} from "lucide-react"
import {Skeleton} from "@/components/ui/skeleton";
import {ParentData} from "@/model/parent-data";
import getPotentialParents from "@/api/graphql/child/getPotentialParents";
import {Button} from "@/components/ui/button";
import getParentById from "@/api/graphql/parent/getParentById";
import {RelativeParent} from "@/model/child-data";
import debounce from "@/utils/debounce";


type AutoCompleteProps = {
    emptyMessage: string
    value?: ParentData
    onValueChange?: (value: ParentData | undefined) => void
    isLoading?: boolean
    disabled?: boolean
    placeholder?: string
    initId?: string
    className?: string
    relativeParents?: RelativeParent[]
}

export const AutoComplete = ({
                                 relativeParents,
                                 className,
                                 initId,
                                 placeholder,
                                 emptyMessage,
                                 value,
                                 onValueChange,
                                 disabled,
                                 isLoading = false,
                             }: AutoCompleteProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const [isOpen, setOpen] = useState(false)
    const [selected, setSelected] = useState<ParentData | undefined>(value as ParentData)
    const [inputValue, setInputValue] = useState<string | undefined>(value ? `${value.familyName} ${value.givenName}` : undefined)
    const [options, setOptions] = useState<ParentData[]>()

    useEffect(() => {
        if (initId)
            getParentById(initId).then(value1 => setInputValue(value1 ? `${value1.familyName} ${value1.givenName}` : undefined))
    }, [initId]);

    const fetchPotentialParents = useCallback((name: string) => {
        getPotentialParents(name)
            .then(parents => {
                const filteredParents = parents.filter((parent) =>
                    !relativeParents?.some(
                        (relativeParent) => relativeParent.id === parent.id
                    )
                );
                setOptions(filteredParents)
                //todo limit for options
            })
            .catch(reason => {
                console.error("Failed to get potential parents:", reason);
            });
    }, [relativeParents]);
    const a = useCallback(() => {
        getPotentialParents("name")
    }, [])
    //const debouncedFetchPotentialParents = debounce(fetchPotentialParents);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedFetchPotentialParents = useCallback(debounce(fetchPotentialParents), [fetchPotentialParents]);
    const b = useCallback(() => {
        a();
    }, [a])

    function potentialParents(event: FormEvent<HTMLInputElement>) {
        const name = event.currentTarget.value
        setInputValue(name);
        if (name) {
            setOpen(name.length > 0);
            debouncedFetchPotentialParents(name);
        } else {
            setOpen(false);
            setOptions(undefined);
        }
    }

    console.log(options)
    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current
            if (!input) {
                return
            }
            // Keep the options displayed when the user is typing
            if (!isOpen) {
                setOpen(true)
            }

            // This is not a default behaviour of the <input /> field
            if (event.key === "Enter" && input.id !== "") {
                const optionToSelect = options?.find((option) => option.id === input.id)
                if (optionToSelect) {
                    setSelected(optionToSelect)
                    onValueChange?.(optionToSelect)
                }
            }

            if (event.key === "Escape") {
                input.blur()
            }
        },
        [isOpen, options, onValueChange]
    )

    const handleBlur = useCallback(() => {
        setOpen(false)
        setInputValue(selected ? `${selected.familyName} ${selected.givenName}` : undefined)
    }, [selected])

    const handleSelectOption = useCallback(
        (selectedOption: ParentData) => {
            setInputValue(selectedOption ? `${selectedOption.familyName} ${selectedOption.givenName}` : undefined)

            setSelected(selectedOption)
            onValueChange?.(selectedOption)

            // This is a hack to prevent the input from being focused after the user selects an option
            // We can call this hack: "The next tick"
            setTimeout(() => {
                inputRef?.current?.blur()
            }, 0)
        },
        [onValueChange]
    )

    return (
        <div className={`relative ${className}`}>
            <CommandPrimitive onKeyDown={handleKeyDown}>
                <div>
                    <CommandInput
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={isLoading ? undefined : setInputValue}
                        onBlur={handleBlur}
                        onFocus={() => setOpen(true)}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="text-base"
                        onInput={potentialParents}
                    />
                </div>
                <div className="mt-1 relative">
                    {isOpen ? (
                        <div
                            className="absolute top-0 z-10 w-full rounded-xl bg-stone-50 outline-none animate-in fade-in-0 zoom-in-95">
                            <CommandList className="ring-1 ring-slate-200 rounded-lg">
                                {isLoading ? (
                                    <CommandPrimitive.Loading>
                                        <div className="p-1">
                                            <Skeleton className="h-8 w-full"/>
                                        </div>
                                    </CommandPrimitive.Loading>
                                ) : null}
                                {options && options.length > 0 ? (
                                    <CommandGroup>
                                        {options.map((option) => {
                                            console.log(option, "a")
                                            const isSelected = selected?.id === option.id
                                            return (
                                                <CommandItem
                                                    key={option.id}
                                                    value={option ? `${option.familyName} ${option.givenName}` : undefined}
                                                    onMouseDown={(event) => {
                                                        event.preventDefault()
                                                        event.stopPropagation()
                                                    }}
                                                    onSelect={() => handleSelectOption(option)}
                                                    className={cn("flex items-center gap-2 w-full", !isSelected ? "pl-8" : null)}
                                                >
                                                    {isSelected ? <Check className="w-4"/> : null}
                                                    {option.familyName} {option.givenName} {option.phoneNumbers[0]}
                                                </CommandItem>
                                            )
                                        })}
                                    </CommandGroup>
                                ) : null}
                                {!isLoading ? (
                                    <CommandPrimitive.Empty
                                        className="select-none rounded-sm px-2 py-3 text-sm text-center">
                                        {emptyMessage}
                                    </CommandPrimitive.Empty>
                                ) : null}
                            </CommandList>

                        </div>
                    ) : null}
                </div>
            </CommandPrimitive>
            <Button
                type="button"
                variant={"ghost"}
                className="absolute top-1 right-1 text-red-500 p-0 mt-1 mr-1 h-fit"
                onClick={() => {
                    onValueChange?.(undefined)
                    setInputValue("")
                    setSelected(undefined)
                    setOptions(undefined)
                }}
            >
                <XIcon/>
            </Button>
        </div>
    )
}