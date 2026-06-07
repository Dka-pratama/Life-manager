import EmptyState from "@/components/feedback/EmptyState";
import Header from "@/components/layout/Header";
import Screen from "@/components/layout/Screen";
import SectionTitle from "@/components/layout/SectionTitle";
import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";

export default function DashboardScreen() {
  return (
    <Screen>
      <Header title="Dashboard" />

      <SectionTitle title="Today's Tasks" />

      <Card>
        <Text variant="bodyLarge">Learn React Native</Text>

        <Text variant="bodySmall" color="secondary">
          Due Today
        </Text>
      </Card>

      <SectionTitle title="Today's Habits" />

      <Card>
        <Text variant="bodyLarge">Drink Water</Text>

        <Text variant="bodySmall" color="secondary">
          3/8 completed
        </Text>
      </Card>

      <SectionTitle title="Recent Notes" />

      <EmptyState title="No Notes Yet" description="Create your first note" />
    </Screen>
  );
}
