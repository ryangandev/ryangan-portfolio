import '@/assets/animations/loading.css';

export default function Loading() {
  return (
    <main
      className="flex h-full flex-col items-center justify-center space-y-4"
      style={{
        minHeight: 'calc(100vh - 145px)',
      }}
    >
      <div className="square-loader"></div>
      <div>
        <span className="text-2xl font-medium tracking-wider">Loading</span>
        <span className="string-loader"></span>
      </div>
    </main>
  );
}
