import { StyleSheet, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from "@/contexts/ThemeContext";
import Text from "../ui/Text";

interface EmptyProps {
  title: string;
  description?: string;
}

export default function EmptyState({ title, description }: EmptyProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
            <Feather 
            name="file" 
            size={32} 
            color={colors.primary} />
      <Text variant="heading3" color="primary">
        {title}
      </Text>
      {description &&
       <Text
       variant="bodySmall"
       color="secondary"
       style={{ 
        textAlign: "center"
        }}
       >{description}
       </Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
  },
});
