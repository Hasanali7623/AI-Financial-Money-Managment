import { useState, useEffect } from "react";
import { transactionService } from "../services/transactionService";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Plus,
  Upload,
  Edit,
  Trash2,
  Filter,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  DollarSign,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { format } from "date-fns";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filter, setFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    type: "EXPENSE",
    description: "",
    transactionDate: new Date().toISOString().split("T")[0],
    merchant: "",
    paymentMethod: "CASH",
    isRecurring: false,
    recurringFrequency: "",
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await transactionService.update(editingTransaction.id, formData);
      } else {
        await transactionService.create(formData);
      }
      loadTransactions();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionService.delete(id);
        loadTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      description: transaction.description || "",
      transactionDate: transaction.transactionDate,
      merchant: transaction.merchant || "",
      paymentMethod: transaction.paymentMethod || "CASH",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
    setFormData({
      amount: "",
      category: "",
      type: "EXPENSE",
      description: "",
      transactionDate: new Date().toISOString().split("T")[0],
      merchant: "",
      paymentMethod: "CASH",
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await transactionService.uploadReceipt(file);
      alert("Receipt uploaded successfully! Check OCR logs for details.");
      setShowUpload(false);
    } catch (error) {
      console.error("Error uploading receipt:", error);
      alert("Failed to upload receipt");
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    // Search filter
    const searchMatch =
      !searchQuery ||
      t.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.merchant?.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter
    const typeMatch = !filters.type || t.type === filters.type;

    // Category filter
    const categoryMatch =
      !filters.category ||
      t.category?.toLowerCase().includes(filters.category.toLowerCase());

    // Date range filter
    const startDateMatch =
      !filters.startDate ||
      new Date(t.transactionDate) >= new Date(filters.startDate);
    const endDateMatch =
      !filters.endDate ||
      new Date(t.transactionDate) <= new Date(filters.endDate);

    // Amount range filter
    const minAmountMatch =
      !filters.minAmount || t.amount >= parseFloat(filters.minAmount);
    const maxAmountMatch =
      !filters.maxAmount || t.amount <= parseFloat(filters.maxAmount);

    return (
      searchMatch &&
      typeMatch &&
      categoryMatch &&
      startDateMatch &&
      endDateMatch &&
      minAmountMatch &&
      maxAmountMatch
    );
  });

  const clearFilters = () => {
    setFilters({
      type: "",
      category: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    });
    setSearchQuery("");
  };

  const hasActiveFilters =
    filters.type ||
    filters.category ||
    filters.startDate ||
    filters.endDate ||
    filters.minAmount ||
    filters.maxAmount ||
    searchQuery;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <DollarSign className="h-10 w-10 mr-3" />
              Transactions
            </h1>
            <p className="text-blue-100 text-lg">
              Track and manage all your financial activities
            </p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold flex items-center shadow-lg transition-all hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Transaction
            </button>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold flex items-center shadow-lg transition-all hover:scale-105"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Search & Filter */}
      <div className="space-y-4">
        <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-xl">
              <Filter className="h-5 w-5 text-purple-600 dark:text-purple-300" />
            </div>
            <input
              type="text"
              placeholder="🔍 Search by category, description, or merchant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field flex-1 text-lg"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>{showFilters ? "Hide Filters" : "Advanced Filters"}</span>
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-200 dark:border-purple-700">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Transaction Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                  className="input-field w-full"
                >
                  <option value="">All Types</option>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g., Food, Transport"
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className="input-field w-full"
                />
              </div>

              {/* Start Date Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                  className="input-field w-full"
                />
              </div>

              {/* End Date Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value })
                  }
                  className="input-field w-full"
                />
              </div>

              {/* Min Amount Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Min Amount
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={filters.minAmount}
                  onChange={(e) =>
                    setFilters({ ...filters, minAmount: e.target.value })
                  }
                  className="input-field w-full"
                />
              </div>

              {/* Max Amount Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Max Amount
                </label>
                <input
                  type="number"
                  placeholder="10000.00"
                  value={filters.maxAmount}
                  onChange={(e) =>
                    setFilters({ ...filters, maxAmount: e.target.value })
                  }
                  className="input-field w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Beautiful Transaction Cards */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`card hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
              transaction.type === "INCOME"
                ? "border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-gray-900"
                : "border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-white dark:from-red-900/20 dark:to-gray-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {/* Icon */}
                <div
                  className={`p-4 rounded-2xl ${
                    transaction.type === "INCOME"
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-red-100 dark:bg-red-900"
                  }`}
                >
                  {transaction.type === "INCOME" ? (
                    <ArrowUpCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowDownCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                  )}
                </div>

                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {transaction.description || transaction.category}
                    </h3>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {transaction.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(
                        new Date(transaction.transactionDate),
                        "MMM dd, yyyy"
                      )}
                    </div>
                    {transaction.merchant && (
                      <div className="flex items-center">
                        <span className="font-medium">
                          🏪 {transaction.merchant}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <div
                    className={`text-3xl font-bold ${
                      transaction.type === "INCOME"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}₹
                    {transaction.amount.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {transaction.type === "INCOME" ? "Income" : "Expense"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(transaction)}
                  className="p-3 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 transition-colors"
                  title="Edit"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="p-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="card text-center py-16">
            <DollarSign className="h-20 w-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
              No transactions found
            </p>
            <p className="text-gray-400 dark:text-gray-500">
              Add your first transaction to get started!
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Transaction Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="input-field"
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.transactionDate}
                onChange={(e) =>
                  setFormData({ ...formData, transactionDate: e.target.value })
                }
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Merchant
            </label>
            <input
              type="text"
              value={formData.merchant}
              onChange={(e) =>
                setFormData({ ...formData, merchant: e.target.value })
              }
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="input-field"
              rows="3"
            />
          </div>

          {/* Recurring Transaction Fields */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isRecurring: e.target.checked,
                    recurringFrequency: e.target.checked
                      ? formData.recurringFrequency
                      : "",
                  })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label
                htmlFor="isRecurring"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                This is a recurring transaction
              </label>
            </div>

            {formData.isRecurring && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency
                </label>
                <select
                  value={formData.recurringFrequency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recurringFrequency: e.target.value,
                    })
                  }
                  className="input-field"
                  required={formData.isRecurring}
                >
                  <option value="">Select frequency</option>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingTransaction ? "Update" : "Add"} Transaction
            </button>
          </div>
        </form>
      </Modal>

      {/* Upload Receipt Modal */}
      <Modal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        title="Upload Receipt"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload a receipt image to automatically extract transaction details
            using OCR.
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="input-field"
          />
          <div className="flex justify-end">
            <button
              onClick={() => setShowUpload(false)}
              className="btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
