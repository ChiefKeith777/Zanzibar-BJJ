import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DARK = '#1d1c18';
const GOLD = '#FCD116';
const BLUE = '#00A3DD';

const WA_HREF = 'https://wa.me/+255628031317';

const LOCATIONS = ['Stone Town', 'Kiwengwa', 'Jambiani', 'Fumba Town'];
const PROGRAMS = [
  { label: 'Adults BJJ', value: 'adults' },
  { label: 'Little Champs (4–7)', value: 'kids47' },
  { label: 'Kids (8–12)', value: 'kids812' },
  { label: 'Teens (13–16)', value: 'teens' },
];
const KIDS_PROGRAMS = ['kids47', 'kids812', 'teens'];
const EXP_OPTIONS = [
  { label: 'Complete beginner', value: 'none' },
  { label: 'Tried it a few times', value: 'some' },
  { label: 'Trains already', value: 'lots' },
];

function PickerRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.pickerWrap}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pickerOptions}
      >
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.pickerChip,
              value === opt && styles.pickerChipActive,
            ]}
            onPress={() => onChange(opt)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.pickerChipText,
                value === opt && styles.pickerChipTextActive,
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default function ContactScreen() {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [program, setProgram] = useState('');
  const [kidName, setKidName] = useState('');
  const [kidAge, setKidAge] = useState('');
  const [kidExp, setKidExp] = useState('');
  const [newsOptIn, setNewsOptIn] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const isKids = KIDS_PROGRAMS.includes(program);

  const buildWaMessage = () => {
    const parts = [
      `Hi, I would like to book a free first class.`,
      `Name: ${name}`,
      phone ? `Phone: ${phone}` : null,
      location ? `Location: ${location}` : null,
      program
        ? `Program: ${PROGRAMS.find((p) => p.value === program)?.label ?? program}`
        : null,
      isKids && kidName ? `Child's name: ${kidName}` : null,
      isKids && kidAge ? `Child's age: ${kidAge}` : null,
      isKids && kidExp
        ? `Experience: ${EXP_OPTIONS.find((e) => e.value === kidExp)?.label ?? kidExp}`
        : null,
    ]
      .filter(Boolean)
      .join('\n');
    return encodeURIComponent(parts);
  };

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) {
      setError('Please enter your name and phone number.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const handleConfirmWa = () => {
    Linking.openURL(`${WA_HREF}?text=${buildWaMessage()}`);
  };

  const handleAnother = () => {
    setSubmitted(false);
    setName('');
    setPhone('');
    setLocation('');
    setProgram('');
    setKidName('');
    setKidAge('');
    setKidExp('');
    setNewsOptIn(false);
    setError('');
  };

  if (submitted) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={styles.successContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Asante! Request received.</Text>
          <Text style={styles.successBody}>
            Your request goes straight to the ZanFit office and we will confirm
            within 24 hours. Tap below to send it on WhatsApp right now.
          </Text>
          <TouchableOpacity
            style={styles.waBtn}
            onPress={handleConfirmWa}
            activeOpacity={0.8}
          >
            <Text style={styles.waBtnText}>Confirm on WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.anotherBtn}
            onPress={handleAnother}
            activeOpacity={0.8}
          >
            <Text style={styles.anotherBtnText}>Submit another request</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.screenHeader}>
          <Text style={styles.kicker}>Get started</Text>
          <Text style={styles.pageTitle}>Book Your Free Class</Text>
          <Text style={styles.pageSub}>
            Fill in the form and we will confirm your spot within 24 hours.
          </Text>
        </View>

        {/* Benefits */}
        <View style={styles.benefits}>
          {[
            'No experience needed — all levels welcome',
            'Gis available to borrow for your first class',
            'Kids and adults programs at 4 locations',
          ].map((b) => (
            <View key={b} style={styles.benefitRow}>
              <Text style={styles.benefitCheck}>✓</Text>
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.fieldLabel}>Your name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your full name"
            placeholderTextColor="#55524a"
            autoCapitalize="words"
          />

          <Text style={styles.fieldLabel}>Phone (WhatsApp)</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+255 xxx xxx xxx"
            placeholderTextColor="#55524a"
            keyboardType="phone-pad"
          />

          <PickerRow
            label="Choose a location"
            options={LOCATIONS}
            value={location}
            onChange={setLocation}
          />

          <PickerRow
            label="Choose a program"
            options={PROGRAMS.map((p) => p.label)}
            value={
              program
                ? PROGRAMS.find((p) => p.value === program)?.label ?? ''
                : ''
            }
            onChange={(label) => {
              const found = PROGRAMS.find((p) => p.label === label);
              if (found) setProgram(found.value);
            }}
          />

          {/* Kids conditional fields */}
          {isKids && (
            <View style={styles.kidsSection}>
              <Text style={styles.kidsSectionTitle}>About your child</Text>

              <Text style={styles.fieldLabel}>Child's name</Text>
              <TextInput
                style={styles.input}
                value={kidName}
                onChangeText={setKidName}
                placeholder="Child's name"
                placeholderTextColor="#55524a"
                autoCapitalize="words"
              />

              <Text style={styles.fieldLabel}>Child's age</Text>
              <TextInput
                style={styles.input}
                value={kidAge}
                onChangeText={setKidAge}
                placeholder="e.g. 9"
                placeholderTextColor="#55524a"
                keyboardType="number-pad"
              />

              <Text style={styles.fieldLabel}>Any previous experience?</Text>
              <View style={styles.expRow}>
                {EXP_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.expChip,
                      kidExp === opt.value && styles.expChipActive,
                    ]}
                    onPress={() => setKidExp(opt.value)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.expChipText,
                        kidExp === opt.value && styles.expChipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* News opt-in */}
          <TouchableOpacity
            style={styles.optInRow}
            onPress={() => setNewsOptIn(!newsOptIn)}
            activeOpacity={0.75}
          >
            <View style={[styles.checkbox, newsOptIn && styles.checkboxActive]}>
              {newsOptIn && <Text style={styles.checkboxMark}>✓</Text>}
            </View>
            <Text style={styles.optInText}>
              Notify me about beach training and events on WhatsApp
            </Text>
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitBtnText}>Book my free class</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.waInstead}
            onPress={() => Linking.openURL(WA_HREF)}
            activeOpacity={0.8}
          >
            <Text style={styles.waInsteadText}>
              Prefer WhatsApp? Message us directly →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contact details */}
        <View style={styles.contactDetails}>
          <Text style={styles.contactDetailsTitle}>Contact</Text>
          <TouchableOpacity onPress={() => Linking.openURL(WA_HREF)}>
            <Text style={styles.contactLink}>+255 628 031 317</Text>
          </TouchableOpacity>
          <Text style={styles.contactMuted}>ZanFit Office · Stone Town</Text>
          <Text style={styles.contactMuted}>Mon–Fri · 09:00–18:00</Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK,
  },

  formContent: {
    paddingBottom: 40,
  },

  screenHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  kicker: {
    color: GOLD,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 6,
  },
  pageSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    lineHeight: 19,
  },

  benefits: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  benefitCheck: {
    color: GOLD,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 1,
  },
  benefitText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },

  form: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  fieldLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 14,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#252420',
    borderWidth: 1,
    borderColor: '#3a3930',
    borderRadius: 8,
    paddingVertical: Platform.OS === 'ios' ? 13 : 10,
    paddingHorizontal: 14,
    color: '#ffffff',
    fontSize: 15,
  },

  // Picker row
  pickerWrap: {
    marginTop: 14,
  },
  pickerLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  pickerOptions: {
    gap: 8,
    paddingVertical: 2,
  },
  pickerChip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3a3930',
    backgroundColor: '#252420',
  },
  pickerChipActive: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  pickerChipText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontWeight: '600',
  },
  pickerChipTextActive: {
    color: DARK,
  },

  // Kids section
  kidsSection: {
    backgroundColor: '#252420',
    borderRadius: 10,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#3a3930',
  },
  kidsSectionTitle: {
    color: GOLD,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  expRow: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 2,
  },
  expChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3a3930',
    backgroundColor: '#1d1c18',
  },
  expChipActive: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  expChipText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontWeight: '600',
  },
  expChipTextActive: {
    color: DARK,
  },

  // Opt-in
  optInRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 18,
    marginBottom: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#55524a',
    backgroundColor: '#252420',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxActive: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  checkboxMark: {
    color: DARK,
    fontSize: 12,
    fontWeight: '800',
  },
  optInText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },

  // Errors
  errorText: {
    color: '#ff6b6b',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 4,
  },

  // Submit
  submitBtn: {
    backgroundColor: GOLD,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 16,
  },
  submitBtnText: {
    color: DARK,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  waInstead: {
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 4,
  },
  waInsteadText: {
    color: '#25D366',
    fontSize: 13,
    fontWeight: '600',
  },

  // Contact details
  contactDetails: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#2e2d28',
    marginTop: 24,
  },
  contactDetailsTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  contactLink: {
    color: BLUE,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  contactMuted: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    lineHeight: 19,
  },

  // Success state
  successContent: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(252,209,22,0.15)',
    borderWidth: 2,
    borderColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successIconText: {
    color: GOLD,
    fontSize: 30,
    fontWeight: '800',
  },
  successTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
  },
  successBody: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 32,
  },
  waBtn: {
    backgroundColor: '#25D366',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  waBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  anotherBtn: {
    borderWidth: 1,
    borderColor: '#3a3930',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  anotherBtnText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
});
