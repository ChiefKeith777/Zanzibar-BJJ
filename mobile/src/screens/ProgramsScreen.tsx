import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PROGRAMS } from '../../../shared/content/data';

const DARK = '#1d1c18';
const GOLD = '#FCD116';
const BLUE = '#00A3DD';
const WA_HREF = 'https://wa.me/+255628031317';
const BOOKING_HREF = `${WA_HREF}?text=${encodeURIComponent('Hi, I would like to book a free first class.')}`;

type ImageSource = ReturnType<typeof require>;

const PROG_IMAGES: Record<string, ImageSource> = {
  'prog-bjj.jpg': require('../assets/prog-bjj.jpg'),
  'prog-kids.jpg': require('../assets/prog-kids.jpg'),
  'prog-beach.jpg': require('../assets/prog-beach.jpg'),
  'prog-comp.jpg': require('../assets/prog-comp.jpg'),
};

const PRICING = [
  {
    key: 'locals',
    title: 'Locals',
    flag: 'First class free',
    rows: [
      { label: 'First class', price: 'FREE' },
      { label: 'Drop-in', price: '10,000 TZS' },
      { label: 'One month', price: '30,000 TZS' },
    ],
    note: 'Local membership includes classes, community and graduation with our mentors from Atlanta Top Team. Gym membership included.',
    cta: 'Start free',
    ctaHref: BOOKING_HREF,
    ctaStyle: 'gold',
  },
  {
    key: 'visitors',
    title: 'Visitors',
    flag: 'First class free',
    rows: [
      { label: 'First class', price: 'FREE' },
      { label: 'Drop-in', price: '$15 USD' },
      { label: 'One week', price: '$50 USD' },
      { label: 'Two weeks', price: '$80 USD' },
    ],
    note: 'Gym membership at House of Muscle included with all visitor packages.',
    cta: 'Book a drop-in',
    ctaHref: BOOKING_HREF,
    ctaStyle: 'blue',
  },
  {
    key: 'kids',
    title: 'Kids',
    flag: 'First class free',
    rows: [
      { label: 'First class', price: 'FREE' },
      { label: 'Drop-in', price: '5,000 TZS' },
      { label: 'One month', price: '20,000 TZS' },
    ],
    note: 'Covers kids group classes only — kids must otherwise be supervised in the gym by an adult.',
    cta: 'Book a kids trial',
    ctaHref: BOOKING_HREF,
    ctaStyle: 'blue',
  },
];

export default function ProgramsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.screenHeader, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.kicker}>What we train</Text>
        <Text style={styles.pageTitle}>Programs</Text>
      </View>

      {/* Program cards */}
      {PROGRAMS.map((prog) => {
        const imgSrc = PROG_IMAGES[prog.img];
        return (
          <View key={prog.id} style={styles.progCard}>
            {imgSrc && (
              <Image
                source={imgSrc}
                style={styles.progImg}
                resizeMode="cover"
              />
            )}
            <View style={styles.progOverlay} />
            {prog.isEvent && (
              <View style={styles.eventBadge}>
                <Text style={styles.eventBadgeText}>EVENT</Text>
              </View>
            )}
            <View style={styles.progBody}>
              <Text style={styles.progTag}>{prog.tag}</Text>
              <Text style={styles.progName}>{prog.name}</Text>
              <Text style={styles.progDesc}>{prog.descEn}</Text>
              <View style={styles.progCtas}>
                <TouchableOpacity
                  style={styles.progCtaPrimary}
                  onPress={() => Linking.openURL(BOOKING_HREF)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.progCtaPrimaryText}>
                    {prog.ctaLabelEn}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.progCtaAlt}
                  onPress={() => Linking.openURL(WA_HREF)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.progCtaAltText}>{prog.altLabelEn}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}

      {/* Pricing section */}
      <View style={styles.pricingSection}>
        <Text style={styles.pricingKicker}>Simple pricing</Text>
        <Text style={styles.pricingTitle}>Prices & Memberships</Text>
        <Text style={styles.pricingNote}>
          Private classes available on request — message us on WhatsApp.
        </Text>

        {PRICING.map((plan) => (
          <View key={plan.key} style={styles.priceCard}>
            <View style={styles.priceCardHeader}>
              <Text style={styles.priceCardTitle}>{plan.title}</Text>
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>{plan.flag}</Text>
              </View>
            </View>

            {plan.rows.map((row) => (
              <View key={row.label} style={styles.priceRow}>
                <Text style={styles.priceLabel}>{row.label}</Text>
                <Text
                  style={[
                    styles.priceValue,
                    row.price === 'FREE' && styles.priceValueFree,
                  ]}
                >
                  {row.price}
                </Text>
              </View>
            ))}

            <Text style={styles.priceCardNote}>{plan.note}</Text>

            <TouchableOpacity
              style={[
                styles.priceCardBtn,
                plan.ctaStyle === 'gold'
                  ? styles.priceCardBtnGold
                  : styles.priceCardBtnBlue,
              ]}
              onPress={() => Linking.openURL(plan.ctaHref)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.priceCardBtnText,
                  plan.ctaStyle === 'gold' && styles.priceCardBtnTextDark,
                ]}
              >
                {plan.cta}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.gymBanner}>
          <Text style={styles.gymBannerTitle}>Gym membership included</Text>
          <Text style={styles.gymBannerBody}>
            All memberships include access to House of Muscle gym in Stone Town.
            Ask your coach for details at other locations.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK,
  },

  screenHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
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
    letterSpacing: 0.2,
  },

  // Program card
  progCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#252420',
  },
  progImg: {
    width: '100%',
    height: 160,
  },
  progOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  eventBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: GOLD,
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  eventBadgeText: {
    color: DARK,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  progBody: {
    padding: 18,
  },
  progTag: {
    color: GOLD,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  progName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  progDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  progCtas: {
    flexDirection: 'row',
    gap: 10,
  },
  progCtaPrimary: {
    flex: 1,
    backgroundColor: BLUE,
    borderRadius: 7,
    paddingVertical: 11,
    alignItems: 'center',
  },
  progCtaPrimaryText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  progCtaAlt: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3a3930',
    borderRadius: 7,
    paddingVertical: 11,
    alignItems: 'center',
  },
  progCtaAltText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '600',
  },

  // Pricing
  pricingSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2e2d28',
  },
  pricingKicker: {
    color: GOLD,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  pricingTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 6,
  },
  pricingNote: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 16,
  },

  priceCard: {
    backgroundColor: '#252420',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2e2d28',
  },
  priceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  priceCardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  freeBadge: {
    backgroundColor: 'rgba(252,209,22,0.15)',
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(252,209,22,0.35)',
  },
  freeBadgeText: {
    color: GOLD,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2e2d28',
  },
  priceLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
  },
  priceValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  priceValueFree: {
    color: GOLD,
  },
  priceCardNote: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 12,
    marginBottom: 14,
    fontStyle: 'italic',
  },
  priceCardBtn: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  priceCardBtnGold: {
    backgroundColor: GOLD,
  },
  priceCardBtnBlue: {
    backgroundColor: BLUE,
  },
  priceCardBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  priceCardBtnTextDark: {
    color: DARK,
  },

  gymBanner: {
    backgroundColor: '#1a2633',
    borderRadius: 10,
    padding: 16,
    marginTop: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#00A3DD33',
  },
  gymBannerTitle: {
    color: BLUE,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  gymBannerBody: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    lineHeight: 18,
  },
});
