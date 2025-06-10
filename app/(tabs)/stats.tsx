import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from '@/lib/supabase';
import dayjs from 'dayjs';

function getStartDate(timeFrame: TimeFrame) {
  switch (timeFrame) {
    case "Daily":
      return dayjs().startOf("day");
    case "Weekly":
      return dayjs().startOf("week");
    case "Monthly":
      return dayjs().startOf("month");
    case "Year":
      return dayjs().startOf("year");
    default:
      return dayjs().startOf("day");
  }
}

type TimeFrame = "Daily" | "Weekly" | "Monthly" | "Year";
type ReportType = "Income" | "Expense";

interface ChartData {
  day: string;
  income: number;
  expense: number;
}

const FinancialApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<"analysis" | "search">(
    "analysis"
  );
  const [selectedTimeFrame, setSelectedTimeFrame] =
    useState<TimeFrame>("Daily");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("30/Apr/2023");
  const [selectedReportType, setSelectedReportType] =
    useState<ReportType>("Expense");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fromDate = getStartDate(selectedTimeFrame);

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", fromDate.toISOString());

      if (!error && data) {
        setTransactions(data);
      }
    };

    fetchData();
  }, [selectedTimeFrame]);

  const getDays = () => {
    const today = dayjs();
    return [...Array(7)].map((_, i) =>
      today.subtract(6 - i, 'day').format('ddd')
    );
  };

  
  const chartData: ChartData[] = getDays().map((dayLabel, index) => {
    const targetDate = dayjs().subtract(6 - index, 'day');

    const dayTransactions = transactions.filter((t) =>
      dayjs(t.created_at).isSame(targetDate, 'day')
    );

    const income = dayTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = dayTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { day: dayLabel, income, expense };
  });

  const maxValue = Math.max(...chartData.map(d => Math.max(d.income, d.expense)));

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const percentExpense = ((totalExpense / 20000) * 100).toFixed(0); // asumsi target $20k

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Error:', error.message);
      } else {
        setTransactions(data);
      }
    };

    fetchTransactions();
  }, []);

  const AnalysisScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#10B981" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceRow}>
            <View>
              <View style={styles.balanceLabel}>
                <View style={styles.greenDot} />
                <Text style={styles.balanceText}>Total Balance</Text>
              </View>
              <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
            </View>
            <View>
              <View style={styles.balanceLabel}>
                <View style={styles.blueDot} />
                <Text style={styles.balanceText}>Total Expenses</Text>
              </View>
              <Text style={styles.expenseAmount}>-${totalExpense.toFixed(2)}</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${percentExpense}%` as unknown as number | `${number}%` }]} />
            </View>
            <Text style={styles.progressText}>{percentExpense}%</Text>
            <Text style={styles.progressAmount}>$20,000.00</Text>
          </View>

          <View style={styles.goodLabel}>
            <View style={styles.checkIcon}>
              <Ionicons name="checkmark" size={12} color="white" />
            </View>
            <Text style={styles.goodText}>
              {percentExpense}% Of Your Expenses, {Number(percentExpense) < 50 ? 'Looks Good' : 'Be Careful'}
            </Text>
          </View>
        </View>

        {/* Time Frame Selector */}
        <View style={styles.timeFrameContainer}>
          {(["Daily", "Weekly", "Monthly", "Year"] as TimeFrame[]).map(
            (timeFrame) => (
              <TouchableOpacity
                key={timeFrame}
                style={[
                  styles.timeFrameButton,
                  selectedTimeFrame === timeFrame && styles.activeTimeFrame,
                ]}
                onPress={() => setSelectedTimeFrame(timeFrame)}
              >
                <Text
                  style={[
                    styles.timeFrameText,
                    selectedTimeFrame === timeFrame &&
                      styles.activeTimeFrameText,
                  ]}
                >
                  {timeFrame}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Chart Section */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Income & Expenses</Text>
            <View style={styles.chartIcons}>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => setCurrentScreen("search")}
              >
                <Ionicons name="search" size={20} color="#10B981" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="calendar-outline" size={20} color="#10B981" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Chart */}
          <View style={styles.chart}>
            <View style={styles.chartYAxis}>
              <Text style={styles.yAxisLabel}>10k</Text>
              <Text style={styles.yAxisLabel}>5k</Text>
              <Text style={styles.yAxisLabel}>0</Text>
            </View>
            <View style={styles.chartBars}>
              {chartData.map((data, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barGroup}>
                    <View
                      style={[
                        styles.incomeBar,
                        { height: (data.income / maxValue) * 80 },
                      ]}
                    />
                    <View
                      style={[
                        styles.expenseBar,
                        { height: (data.expense / maxValue) * 80 },
                      ]}
                    />
                  </View>
                  <Text style={styles.dayLabel}>{data.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="trending-up" size={20} color="#10B981" />
            </View>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={styles.summaryAmount}>${totalIncome.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="trending-down" size={20} color="#3B82F6" />
            </View>
            <Text style={styles.summaryLabel}>Expense</Text>
            <Text style={styles.summaryAmountBlue}>${totalExpense.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const SearchScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#10B981" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentScreen("analysis")}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.searchContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Input */}
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Categories */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Categories</Text>
          <TouchableOpacity style={styles.categorySelector}>
            <Text style={styles.categorySelectorText}>
              {selectedCategory || "Select the category"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#10B981" />
          </TouchableOpacity>
        </View>

        {/* Date */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Date</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{selectedDate}</Text>
            <TouchableOpacity style={styles.calendarButton}>
              <Ionicons name="calendar" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Report Type */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Report</Text>
          <View style={styles.reportTypeContainer}>
            <TouchableOpacity
              style={[
                styles.reportTypeButton,
                selectedReportType === "Income" && styles.activeReportType,
              ]}
              onPress={() => setSelectedReportType("Income")}
            >
              <View
                style={[
                  styles.radioButton,
                  selectedReportType === "Income" && styles.activeRadio,
                ]}
              />
              <Text style={styles.reportTypeText}>Income</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.reportTypeButton,
                selectedReportType === "Expense" && styles.activeReportType,
              ]}
              onPress={() => setSelectedReportType("Expense")}
            >
              <View
                style={[
                  styles.radioButton,
                  selectedReportType === "Expense" && styles.activeRadio,
                ]}
              />
              <Text style={styles.reportTypeText}>Expense</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Button */}
        <TouchableOpacity style={styles.searchActionButton}>
          <Text style={styles.searchActionText}>Search</Text>
        </TouchableOpacity>

        {/* Search Result */}
        <View style={styles.resultContainer}>
          <View style={styles.resultItem}>
            <View style={styles.resultIcon}>
              <Ionicons name="restaurant" size={24} color="#3B82F6" />
            </View>
            <View style={styles.resultContent}>
              <Text style={styles.resultTitle}>Dinner</Text>
              <Text style={styles.resultDate}>18:27 - April 30</Text>
            </View>
            <Text style={styles.resultAmount}>-$26.00</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  return currentScreen === "analysis" ? <AnalysisScreen /> : <SearchScreen />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10B981",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  balanceCard: {
    backgroundColor: "#10B981",
    padding: 20,
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  balanceLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  greenDot: {
    width: 8,
    height: 8,
    backgroundColor: "#34D399",
    borderRadius: 4,
    marginRight: 8,
  },
  blueDot: {
    width: 8,
    height: 8,
    backgroundColor: "#60A5FA",
    borderRadius: 4,
    marginRight: 8,
  },
  balanceText: {
    color: "white",
    fontSize: 14,
  },
  balanceAmount: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  expenseAmount: {
    color: "#60A5FA",
    fontSize: 24,
    fontWeight: "bold",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    marginRight: 10,
  },
  progressFill: {
    width: "30%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 4,
  },
  progressText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 10,
  },
  progressAmount: {
    color: "white",
    fontSize: 12,
  },
  goodLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkIcon: {
    width: 16,
    height: 16,
    backgroundColor: "#34D399",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  goodText: {
    color: "white",
    fontSize: 12,
  },
  timeFrameContainer: {
    flexDirection: "row",
    backgroundColor: "#F0FDF4",
    margin: 20,
    borderRadius: 25,
    padding: 4,
  },
  timeFrameButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 20,
  },
  activeTimeFrame: {
    backgroundColor: "#10B981",
  },
  timeFrameText: {
    color: "#6B7280",
    fontWeight: "500",
  },
  activeTimeFrameText: {
    color: "white",
  },
  chartContainer: {
    backgroundColor: "#F0FDF4",
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  chartIcons: {
    flexDirection: "row",
    gap: 15,
  },
  searchButton: {
    padding: 5,
  },
  chart: {
    flexDirection: "row",
    height: 120,
  },
  chartYAxis: {
    justifyContent: "space-between",
    paddingRight: 10,
    paddingVertical: 10,
  },
  yAxisLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  chartBars: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingBottom: 20,
  },
  barContainer: {
    alignItems: "center",
  },
  barGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
    marginBottom: 8,
  },
  incomeBar: {
    width: 8,
    backgroundColor: "#10B981",
    borderRadius: 4,
  },
  expenseBar: {
    width: 8,
    backgroundColor: "#3B82F6",
    borderRadius: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  summaryContainer: {
    flexDirection: "row",
    margin: 20,
    gap: 20,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    color: "white",
    fontSize: 14,
    marginBottom: 4,
  },
  summaryAmount: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  summaryAmountBlue: {
    color: "#60A5FA",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  searchInputContainer: {
    margin: 20,
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 10,
  },
  categorySelector: {
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categorySelectorText: {
    color: "#6B7280",
    fontSize: 14,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  dateText: {
    color: "#1F2937",
    fontSize: 14,
    fontWeight: "500",
  },
  calendarButton: {
    backgroundColor: "#10B981",
    borderRadius: 8,
    padding: 8,
  },
  reportTypeContainer: {
    flexDirection: "row",
    gap: 20,
  },
  reportTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    backgroundColor: "white",
  },
  activeRadio: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  reportTypeText: {
    color: "#1F2937",
    fontSize: 14,
    fontWeight: "500",
  },
  activeReportType: {},
  searchActionButton: {
    backgroundColor: "#10B981",
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 30,
  },
  searchActionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  resultContainer: {
    marginHorizontal: 20,
  },
  resultItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultIcon: {
    width: 50,
    height: 50,
    backgroundColor: "#DBEAFE",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  resultDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  resultAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
});

export default FinancialApp;