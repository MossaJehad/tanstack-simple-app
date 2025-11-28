import { Pencil, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useRef, useState } from 'react';
import { LoadingSwap } from './ui/loading-swap';
import { z } from 'zod';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import { db } from '../db';
import { tanstack } from '../db/schema';
import { redirect } from '@tanstack/react-router';
import { Items } from '../lib/interface';
import { eq } from 'drizzle-orm';

const addTodo = createServerFn({ method: 'POST' })
	.inputValidator(
		z.object({
			name: z.string().min(1, 'Name is required'),
		}),
	)
	.handler(async ({ data }) => {
		await db.insert(tanstack).values({ ...data, isDone: false });
		throw redirect({ to: '/' });
	});

const updateTodo = createServerFn({ method: 'POST' })
	.inputValidator(
		z.object({
			id: z.string().min(1),
			name: z.string().min(1, 'Name is required'),
		}),
	)
	.handler(async ({ data }) => {
		await db.update(tanstack).set(data).where(eq(tanstack.id, data.id))
		throw redirect({ to: '/' });
	});

export default function TodoForm({ todo }: { todo?: Items }) {
	const nameRef = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState(false);
	const addTodoFn = useServerFn(addTodo);
	const updateTodoFn = useServerFn(updateTodo);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!nameRef.current?.value) return;
		setIsLoading(true);
		if (todo == null)
			await addTodoFn({ data: { name: nameRef.current?.value } });
		else
			await updateTodoFn({ data: { id: todo.id, name: nameRef.current?.value } })
		setIsLoading(false);
	}

	return (
		<div>
			<form className="flex gap-2" onSubmit={handleSubmit}>
				<Input
					autoFocus
					ref={nameRef}
					placeholder="Enter todo name"
					className="flex-1"
					aria-label="Name"
					defaultValue={todo?.name}
				/>
				<Button
					type="submit"
					disabled={isLoading}
					className="cursor-pointer"
				>
					<LoadingSwap
						isLoading={isLoading}
						className="flex gap-2 items-center"
					>
						{todo ? <Pencil /> : <Plus />}
						{todo ? 'Update' : 'Add'}
					</LoadingSwap>
				</Button>
			</form>
		</div>
	);
}
