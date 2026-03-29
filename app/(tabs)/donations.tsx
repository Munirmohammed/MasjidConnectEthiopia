import React, { useState } from 'react';
import { StyleSheet, View, Text, useColorScheme, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '../../constants/Colors';
import { CAMPAIGNS, Campaign } from '../../constants/Community';
import { donationService } from '../../services/donationService';
import * as WebBrowser from 'expo-web-browser';

export default function DonationsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme as keyof typeof Colors];
  
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [amountStr, setAmountStr] = useState('');
  const [loadingPayment, setLoadingPayment] = useState(false);

  const renderCampaign = ({ item }: { item: Campaign }) => {
    const progress = Math.min(item.raised / item.goal, 1);
    const isSelected = selectedCampaign === item.id;
    return (
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.campaignTitle, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.mosqueName, { color: theme.primary }]}>{item.mosqueName}</Text>
        <Text style={[styles.description, { color: theme.tabIconDefault }]}>{item.description}</Text>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: theme.primary }]} />
          </View>
          <View style={styles.progressStats}>
            <Text style={[styles.statsText, { color: theme.text }]}>
              {item.raised.toLocaleString()} ETB raised
            </Text>
            <Text style={[styles.statsText, { color: theme.tabIconDefault }]}>
              Goal: {item.goal.toLocaleString()} ETB
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: isSelected ? theme.border : theme.primary }]}
          onPress={() => setSelectedCampaign(isSelected ? null : item.id)}
        >
          <Text style={[styles.actionButtonText, { color: isSelected ? theme.text : '#fff' }]}>
            {isSelected ? 'Cancel' : 'Donate Now'}
          </Text>
        </TouchableOpacity>

        {isSelected && (
          <View style={styles.donateForm}>
             <TextInput 
                keyboardType="numeric"
                style={[styles.input, { borderColor: theme.border, color: theme.text }]}
                placeholder="Amount (ETB)"
                placeholderTextColor={theme.tabIconDefault}
                value={amountStr}
                onChangeText={setAmountStr}
             />
             <TouchableOpacity 
               style={[styles.payButton, { backgroundColor: '#FF8C00' }]} 
               disabled={loadingPayment}
               onPress={async () => {
                 const amt = parseFloat(amountStr);
                 if (isNaN(amt) || amt <= 0) {
                    Alert.alert("Invalid Input", "Please enter a valid amount.");
                    return;
                 }
                 setLoadingPayment(true);
                 try {
                    const res = await donationService.initiate(amt, item.id);
                    const checkoutUrl = (res as any).checkout_url || (res as any).data?.checkout_url;
                    if (checkoutUrl) {
                       await WebBrowser.openBrowserAsync(checkoutUrl);
                       Alert.alert("Payment Finished", "Your donation transaction status is being processed.");
                    } else {
                       Alert.alert("Note", "Donation initiated but no checkout URL was returned by the backend.");
                    }
                 } catch (e) {
                    console.warn(e);
                    Alert.alert("Payment Error", "Could not reach the payment gateway. Please check your connection.");
                 } finally {
                    setLoadingPayment(false);
                 }
               }}
             >
               {loadingPayment ? <ActivityIndicator color="#fff" /> : <Text style={styles.payButtonText}>Pay with Telebirr / Chapa</Text>}
             </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={CAMPAIGNS as any}
        renderItem={renderCampaign as any}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, color: theme.tabIconDefault, fontFamily: 'Inter' }}>
               Support our mosques securely using Chapa payment gateways. Choose your amount and checkout with Telebirr or CBE Birr.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16 },
  card: { borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  campaignTitle: { fontSize: 18, fontFamily: 'InterBold' },
  mosqueName: { fontSize: 14, fontFamily: 'InterBold', marginTop: 2 },
  description: { fontSize: 14, fontFamily: 'Inter', marginVertical: 12, lineHeight: 20 },
  progressContainer: { marginBottom: 20 },
  progressBar: { height: 8, borderRadius: 4, marginBottom: 8 },
  progressFill: { height: 8, borderRadius: 4 },
  progressStats: { flexDirection: 'row', justifyContent: 'space-between' },
  statsText: { fontSize: 12, fontFamily: 'InterBold' },
  actionButton: { height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionButtonText: { fontSize: 16, fontFamily: 'InterBold' },
  donateForm: { marginTop: 16, padding: 12, borderRadius: 12, backgroundColor: 'rgba(6, 95, 70, 0.05)' },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16 },
  payButton: { height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  payButtonText: { color: '#fff', fontSize: 16, fontFamily: 'InterBold' }
});
