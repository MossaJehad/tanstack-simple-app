import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TodoForm from '@/components/todoform';

export const Route = createFileRoute('/todos/new/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className='container space-y-2 p-8'>
			<Button
			asChild
			variant="ghost"
			className='text-muted-foreground cursor-pointer'
			>
				<Link to="/">
					<ArrowLeft />
					Back to Home
				</Link>
			</Button>
			<Card>
				<CardHeader>
					<CardTitle>Add New Todo</CardTitle>
					<CardDescription>
						Create a new todo
					</CardDescription>
				</CardHeader>
				<CardContent>
					<TodoForm />
				</CardContent>
			</Card>
		</div>
	);
}
