import { createFileRoute, Link } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { db } from '../db';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ListTodoIcon, Plus } from 'lucide-react';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

const serverLoader = createServerFn({ method: 'GET' }).handler(() => {
	return db.query.tanstack.findMany();
});

export const Route = createFileRoute('/')({
	component: App,
	loader: () => {
		return serverLoader();
	},
});

interface Items {
	id: string;
	name: string;
	isDone: boolean;
	createdAt: string;
	updatedAt: string;
}

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
			<Empty className='border border-dotted border-gray-200 p-8'>
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
}