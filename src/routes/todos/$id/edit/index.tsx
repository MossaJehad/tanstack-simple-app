import { Button } from '@/components/ui/button';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TodoForm from '@/components/todoform';
import { createServerFn } from '@tanstack/react-start';
import { tanstack } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/db';

const loaderFn = createServerFn({ method: 'GET' }).inputValidator((
	data: { id: string }) => data
).handler(async ({ data }) => {
	const todo = await db.query.tanstack.findFirst({ where: eq(tanstack.id, data.id) });

	if (todo == null)
		throw notFound()
	return todo
})

export const Route = createFileRoute('/todos/$id/edit/')({
	component: RouteComponent,
	loader: ({ params }) => {
		return loaderFn({ data: { id: params.id } });
	}
});

function RouteComponent() {
	const todo = Route.useLoaderData()
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
					<CardTitle>Edit Todo - </CardTitle>
					<CardDescription>
						Update todo details
					</CardDescription>
				</CardHeader>
				<CardContent>
					<TodoForm todo={todo} />
				</CardContent>
			</Card>
		</div>
	)
}
