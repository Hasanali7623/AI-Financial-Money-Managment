import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { analyticsService } from "../services/analyticsService";
import { transactionService } from "../services/transactionService";
import { budgetService } from "../services/budgetService";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PieChart as PieChartIcon,
  Plus,
  Upload,
  Calendar,
  ArrowRight,
  Clock,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [topBudgets, setTopBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [summaryData, categorySpending, trends, transactions, budgets] =
        await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getCategorySpending(),
          analyticsService.getMonthlyTrends(),
          transactionService.getAll(),
          budgetService.getAll(),
        ]);

      setSummary(summaryData);
      setCategoryData(categorySpending);
      setMonthlyData(trends);
      setRecentTransactions(transactions.slice(0, 5)); // Get last 5 transactions
      setTopBudgets(budgets.slice(0, 3)); // Get top 3 budgets
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's your financial overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={`₹${summary?.totalBalance?.toLocaleString() || 0}`}
          icon={DollarSign}
          color="primary"
          trend="+12% from last month"
        />
        <StatCard
          title="Total Income"
          value={`₹${summary?.totalIncome?.toLocaleString() || 0}`}
          icon={TrendingUp}
          color="success"
          trend="This month"
        />
        <StatCard
          title="Total Expenses"
          value={`₹${summary?.totalExpenses?.toLocaleString() || 0}`}
          icon={TrendingDown}
          color="danger"
          trend="This month"
        />
        <StatCard
          title="Savings Goals"
          value={`${summary?.savingsGoalsCount || 0}`}
          icon={Target}
          color="purple"
          trend={`${summary?.achievedGoals || 0} achieved`}
        />
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Comparison */}
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Income Overview
            </h3>
            <ArrowUpRight className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            ₹{summary?.totalIncome?.toLocaleString() || 0}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total income this period
          </p>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Expenses Overview
            </h3>
            <ArrowDownRight className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
            ₹{summary?.totalExpenses?.toLocaleString() || 0}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total expenses this period
          </p>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Net Savings
            </h3>
            <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            ₹
            {(
              (summary?.totalIncome || 0) - (summary?.totalExpenses || 0)
            ).toLocaleString()}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {summary?.totalIncome > summary?.totalExpenses
              ? "Positive cash flow"
              : "Negative cash flow"}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Spending Pie Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Spending by Category
            </h2>
            <PieChartIcon className="h-5 w-5 text-gray-400" />
          </div>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {categoryData.slice(0, 6).map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {item.name}: ₹{item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <PieChartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No expense data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Monthly Comparison Pie Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Income vs Expenses
            </h2>
            <PieChartIcon className="h-5 w-5 text-gray-400" />
          </div>
          {monthlyData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Total Income",
                        value: monthlyData.reduce(
                          (sum, m) => sum + m.income,
                          0
                        ),
                      },
                      {
                        name: "Total Expenses",
                        value: monthlyData.reduce(
                          (sum, m) => sum + m.expenses,
                          0
                        ),
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name.split(" ")[1]}: ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      Total Income
                    </span>
                  </div>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    ₹
                    {monthlyData
                      .reduce((sum, m) => sum + m.income, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      Total Expenses
                    </span>
                  </div>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">
                    ₹
                    {monthlyData
                      .reduce((sum, m) => sum + m.expenses, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <PieChartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No monthly data available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions & Budget Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Recent Transactions
            </h2>
            <button
              onClick={() => navigate("/transactions")}
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${
                        transaction.type === "INCOME"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-red-100 dark:bg-red-900/30"
                      }`}
                    >
                      {transaction.type === "INCOME" ? (
                        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.category} •{" "}
                        {new Date(
                          transaction.transactionDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-bold ${
                      transaction.type === "INCOME"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}₹
                    {transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No transactions yet</p>
              <button
                onClick={() => navigate("/transactions")}
                className="mt-4 text-purple-600 dark:text-purple-400 hover:underline"
              >
                Add your first transaction
              </button>
            </div>
          )}
        </div>

        {/* Budget Progress */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Budget Progress
            </h2>
            <button
              onClick={() => navigate("/budgets")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          {topBudgets.length > 0 ? (
            <div className="space-y-4">
              {topBudgets.map((budget) => {
                const percentage =
                  ((budget.spentAmount || 0) / budget.amount) * 100;
                const isWarning = percentage >= 80 && percentage < 100;
                const isOver = percentage >= 100;
                return (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {budget.category}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ₹{(budget.spentAmount || 0).toLocaleString()} / ₹
                        {budget.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          isOver
                            ? "bg-red-600"
                            : isWarning
                            ? "bg-yellow-600"
                            : "bg-green-600"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`font-medium ${
                          isOver
                            ? "text-red-600 dark:text-red-400"
                            : isWarning
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-green-600 dark:text-green-400"
                        }`}
                      >
                        {percentage.toFixed(1)}% used
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        ₹
                        {(
                          budget.amount - (budget.spentAmount || 0)
                        ).toLocaleString()}{" "}
                        left
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No budgets set</p>
              <button
                onClick={() => navigate("/budgets")}
                className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Create your first budget
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/transactions")}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-200 dark:border-purple-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
              Add Transaction
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Record income or expense
            </p>
          </button>
          <button
            onClick={() => navigate("/transactions")}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-blue-200 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
              Upload Receipt
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Scan and add automatically
            </p>
          </button>
          <button
            onClick={() => navigate("/budgets")}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-green-200 dark:border-green-700 hover:border-green-500 dark:hover:border-green-500 transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
              Set Budget
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Control your spending
            </p>
          </button>
          <button
            onClick={() => navigate("/savings")}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-orange-200 dark:border-orange-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
              Create Goal
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Save for your future
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
