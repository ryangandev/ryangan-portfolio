import '@/assets/animations/loading.css';

export default function Loading() {
  return (
    <main className="flex flex-col items-center justify-center space-y-4">
      <div className="square-loader"></div>
      <div>
        <span className="text-2xl font-medium tracking-wider">Loading</span>
        <span className="string-loader"></span>
      </div>
    </main>
  );
}
