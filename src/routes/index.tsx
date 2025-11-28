import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import { db } from '../db';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { EditIcon, ListTodoIcon, Plus, TrashIcon } from 'lucide-react';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Items } from '@/lib/interface';
import z from 'zod';
import { tanstack } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useState } from 'react';

const serverLoader = createServerFn({ method: 'GET' }).handler(() => {
	return db.query.tanstack.findMany();
});

export const Route = createFileRoute('/')({
	component: App,
	loader: () => {
		return serverLoader();
	},
});


function App() {
	const data = Route.useLoaderData() as Items[];

	const dones = data.filter((item) => item.isDone).length;
	const total = data.length;

	return (
		<div className="min-h-screen container space-y-8 p-8">
			<div className="flex justify-between items-center gap-4">
				<div className="space-y-2">
					<h1 className="text-3xl font-extrabold text-gray-900">
						TANSTACK
					</h1>
					<Badge variant="outline" className="text-sm">
						{dones} out of {total} Completed
					</Badge>
				</div>
				<div>
					<Button size="sm" asChild>
						<Link to="/todos/new">
							<Plus />
							Add
						</Link>
					</Button>
				</div>
			</div>
			<TodoListTable items={data} />
		</div>
	);
}

function TodoListTable({ items }: { items: Items[] }) {
	if (items.length === 0) {
		return (
			<Empty className="border border-dotted border-gray-200 p-8">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<ListTodoIcon />
					</EmptyMedia>
					<EmptyTitle>No Todos</EmptyTitle>
					<EmptyDescription>
						You don't have any todos yet.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button asChild>
						<Link to="/todos/new">
							<Plus />
							Add
						</Link>
					</Button>
				</EmptyContent>
			</Empty>
		);
	}
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Status</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Created At</TableHead>
					<TableHead>Updated At</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{items.map((item) => (
					<TodoTableRow key={item.id} item={item} />
				))}
			</TableBody>
		</Table>
	);
}

const deleteFn = createServerFn({ method: 'POST' })
	.inputValidator(z.object({ id: z.string().min(1) }))
	.handler(async ({ data }) => {
		await db.delete(tanstack).where(eq(tanstack.id, data.id));
		throw redirect({ to: '/' });
	});

const toggleFn = createServerFn({ method: 'POST' })
	.inputValidator(z.object({ isDone: z.boolean(), id: z.string().min(1) }))
	.handler(async ({ data }) => {
		await db.update(tanstack).set({ isDone: !data.isDone }).where(eq(tanstack.id, data.id));
		throw redirect({ to: '/' });
	});

function TodoTableRow({ item }: { item: Items }) {
	const deleteServerFn = useServerFn(deleteFn);
	const toggleServerFn = useServerFn(toggleFn);
	const [isCurrent, setIsCurrent] = useState(item.isDone);
	return (
		<TableRow>
			<TableCell>
				<Checkbox className='cursor-pointer' checked={isCurrent} onCheckedChange={() => {
					setIsCurrent(!isCurrent);
					toggleServerFn({ data: { id: item.id, isDone: item.isDone } })
				}} />
			</TableCell>
			<TableCell
				className={cn(
					'font-medium',
					isCurrent && 'line-through text-muted-foreground',
				)}
			>
				{item.name}
			</TableCell>
			<TableCell
				className={cn(
					'font-medium',
					isCurrent && 'line-through text-muted-foreground',
				)}
			>
				{formatDate(item.createdAt)}
			</TableCell>
			<TableCell
				className={cn(
					'font-medium',
					isCurrent && 'line-through text-muted-foreground',
				)}
			>
				{formatDate(item.updatedAt)}
			</TableCell>
			<TableCell>
				<Button
					asChild
					variant="ghost"
					size="icon-sm"
					className="text-muted-foreground cursor-pointer"
				>
					<Link
						to="/todos/$id/edit"
						params={{
							id: item.id,
						}}
					>
						<EditIcon />
					</Link>
				</Button>
				<Button
					asChild
					variant="ghost"
					size="icon-sm"
					className="text-muted-foreground cursor-pointer hover:bg-red-200"
					onClick={() => deleteServerFn({ data: { id: item.id } })}
				>
					<Link to="/">
						<TrashIcon />
					</Link>
				</Button>
			</TableCell>
		</TableRow>
	);
}

function formatDate(date: string | Date) {
	return new Intl.DateTimeFormat('en-US', {
		dateStyle: 'short',
	}).format(new Date(date));
}
