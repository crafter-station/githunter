"use client";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

const MAX_DEVELOPERS = 6;

interface CompareSelectButtonProps {
	username: string;
	fullname: string;
	avatarUrl?: string;
}

export function CompareSelectButton({
	username,
	fullname,
}: CompareSelectButtonProps) {
	// Usando nuqs para manejar el estado de los desarrolladores seleccionados en la URL
	const [selectedDevs, setSelectedDevs] = useQueryState(
		"devs",
		parseAsArrayOf(parseAsString).withDefault([]),
	);
	const [isSelected, setIsSelected] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);

	// Comprobar si este desarrollador está seleccionado o si se alcanzó el máximo
	useEffect(() => {
		const isDevSelected = selectedDevs.includes(username);
		setIsSelected(isDevSelected);

		// Deshabilitar si ya hay MAX_DEVELOPERS seleccionados y este no está entre ellos
		setIsDisabled(selectedDevs.length >= MAX_DEVELOPERS && !isDevSelected);
	}, [selectedDevs, username]);

	const handleToggle = (checked: boolean) => {
		if (checked) {
			// Añadir este desarrollador si no excede el máximo
			if (selectedDevs.length < MAX_DEVELOPERS) {
				setSelectedDevs([...selectedDevs, username]);
			}
		} else {
			// Eliminar este desarrollador
			setSelectedDevs(selectedDevs.filter((dev) => dev !== username));
		}
	};

	return (
		<div
			className={`absolute top-2 right-2 flex items-center gap-1 rounded-md border border-border/30 bg-card/80 p-1 shadow-sm backdrop-blur-sm transition-opacity duration-200 ${isSelected ? "opacity-100" : "md:opacity-0 md:group-hover:opacity-100"}`}
		>
			<Checkbox
				id={`compare-${username}`}
				checked={isSelected}
				disabled={isDisabled}
				onCheckedChange={handleToggle}
			/>
			<Label
				htmlFor={`compare-${username}`}
				className={`cursor-pointer whitespace-nowrap text-xs ${isDisabled ? "text-muted-foreground" : ""}`}
			>
				Comparar
			</Label>
		</div>
	);
}
