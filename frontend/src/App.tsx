import { TransactionList } from './components/TransactionList';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <TransactionList />
        </div>
      </div>
    </div>
  );
}

export default App;
