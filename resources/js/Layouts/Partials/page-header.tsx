export default function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className='space-y-0.5'>
      <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
      <p className='hidden text-muted-foreground md:block'>{description}</p>
    </div>
  )
}
