import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SW } = Dimensions.get('window');

const DARK = '#1d1c18';
const GOLD = '#FCD116';
const BLUE = '#00A3DD';
const SAND = '#f4f1ea';
const WA_HREF = 'https://wa.me/+255628031317';
const BOOKING_HREF = `${WA_HREF}?text=${encodeURIComponent('Hi, I would like to book a free first class.')}`;

const MARQUEE_ITEMS = [
  'Brazilian Jiu Jitsu', '·', 'Zanzibar', '·', 'Stone Town', '·',
  'Kiwengwa', '·', 'Jambiani', '·', 'Fumba Town', '·',
  'Brazilian Jiu Jitsu', '·', 'Zanzibar', '·', 'Stone Town', '·',
  'Kiwengwa', '·', 'Jambiani', '·', 'Fumba Town', '·',
];

const LOCATIONS = [
  { name: 'Stone Town', img: require('../assets/loc-stone.jpg') },
  { name: 'Kiwengwa', img: require('../assets/loc-kiwengwa.jpg') },
  { name: 'Jambiani', img: require('../assets/loc-jambiani.jpg') },
  { name: 'Fumba Town', img: require('../assets/loc-fumba.jpg') },
];

function MarqueeBar() {
  const translateX = useRef(new Animated.Value(0)).current;
  const marqueeWidth = MARQUEE_ITEMS.join('  ').length * 9;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(translateX, {
        toValue: -marqueeWidth / 2,
        duration: 18000,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={styles.marqueeBar}>
      <Animated.View
        style={[styles.marqueeInner, { transform: [{ translateX }] }]}
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <Text key={i} style={styles.marqueeText}>
            {item}{'  '}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Image
          source={require('../assets/logo-circle.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>ZANZIBAR BJJ</Text>
          <Text style={styles.headerSub}>ROAN JUCAO ASSOCIATION</Text>
        </View>
      </View>

      {/* Hero */}
      <View style={styles.heroWrap}>
        <Image
          source={require('../assets/hero-1.jpg')}
          style={styles.heroImg}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroKicker}>
            Brazilian Jiu Jitsu · Zanzibar, Tanzania
          </Text>
          <Text style={styles.heroH1}>
            Jiu Jitsu for{'\n'}
            <Text style={{ color: GOLD }}>Zanzibar.</Text>
          </Text>
          <Text style={styles.heroSub}>
            World-class Brazilian Jiu Jitsu for locals, visitors and kids —
            four locations across the island. Your first class is free.
          </Text>
          <View style={styles.heroCtas}>
            <TouchableOpacity
              style={styles.ctaBlue}
              onPress={() => Linking.openURL(BOOKING_HREF)}
              activeOpacity={0.8}
            >
              <Text style={styles.ctaBlueText}>Book Free First Class</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ctaGreen}
              onPress={() => Linking.openURL(WA_HREF)}
              activeOpacity={0.8}
            >
              <Text style={styles.ctaGreenText}>WhatsApp Us</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Marquee */}
      <MarqueeBar />

      {/* Locations */}
      <View style={styles.section}>
        <Text style={styles.sectionKicker}>Four locations</Text>
        <Text style={styles.sectionTitle}>Where We Train</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.locScroll}
        >
          {LOCATIONS.map((loc) => (
            <View key={loc.name} style={styles.locCard}>
              <Image source={loc.img} style={styles.locImg} resizeMode="cover" />
              <View style={styles.locOverlay} />
              <Text style={styles.locName}>{loc.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Funnel card */}
      <View style={styles.funnelCard}>
        <View style={styles.funnelBadge}>
          <Text style={styles.funnelBadgeText}>FREE</Text>
        </View>
        <Text style={styles.funnelTitle}>Your first class is free.</Text>
        <Text style={styles.funnelBody}>
          Fill in the booking form and we will confirm your spot, or message
          the ZanFit office on WhatsApp and we will connect you with the coach
          at your location.
        </Text>
        <Text style={styles.funnelNote}>
          Takes under a minute. No payment needed to book.
        </Text>
        <View style={styles.funnelBenefits}>
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
        <TouchableOpacity
          style={styles.funnelBtnBlue}
          onPress={() => Linking.openURL(BOOKING_HREF)}
          activeOpacity={0.8}
        >
          <Text style={styles.funnelBtnBlueText}>Book My Free Class</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.funnelBtnGreen}
          onPress={() => Linking.openURL(WA_HREF)}
          activeOpacity={0.8}
        >
          <Text style={styles.funnelBtnGreenText}>Message on WhatsApp</Text>
        </TouchableOpacity>
      </View>

      {/* Contact info */}
      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Get in touch</Text>
        <TouchableOpacity onPress={() => Linking.openURL(WA_HREF)}>
          <Text style={styles.contactLink}>+255 628 031 317</Text>
        </TouchableOpacity>
        <Text style={styles.contactMuted}>ZanFit Office — Stone Town</Text>
        <Text style={styles.contactMuted}>Mon–Fri · 09:00–18:00</Text>
        <Text style={[styles.contactMuted, { marginTop: 12, fontStyle: 'italic' }]}>
          Oss. Everyone starts as a white belt.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: DARK,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 2.5,
  },
  headerSub: {
    color: GOLD,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.8,
    marginTop: 1,
  },

  // Hero
  heroWrap: {
    width: SW,
    height: 480,
    position: 'relative',
  },
  heroImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.62)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  heroKicker: {
    color: GOLD,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  heroH1: {
    color: '#ffffff',
    fontSize: 38,
    fontWeight: '900',
    lineHeight: 44,
    marginBottom: 14,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  heroCtas: {
    flexDirection: 'column',
    gap: 10,
  },
  ctaBlue: {
    backgroundColor: BLUE,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaBlueText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  ctaGreen: {
    borderWidth: 2,
    borderColor: '#25D366',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaGreenText: {
    color: '#25D366',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Marquee
  marqueeBar: {
    backgroundColor: GOLD,
    paddingVertical: 10,
    overflow: 'hidden',
  },
  marqueeInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marqueeText: {
    color: DARK,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },

  // Sections
  section: {
    paddingTop: 32,
    paddingBottom: 8,
  },
  sectionKicker: {
    color: GOLD,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.3,
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  // Location cards
  locScroll: {
    paddingLeft: 20,
    paddingRight: 8,
    gap: 12,
  },
  locCard: {
    width: 160,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  locImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  locOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  locName: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  // Funnel card
  funnelCard: {
    margin: 20,
    backgroundColor: '#252420',
    borderRadius: 12,
    padding: 22,
    borderWidth: 1,
    borderColor: '#2e2d28',
  },
  funnelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: GOLD,
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  funnelBadgeText: {
    color: DARK,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  funnelTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
    lineHeight: 28,
  },
  funnelBody: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 8,
  },
  funnelNote: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  funnelBenefits: {
    marginBottom: 20,
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
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  funnelBtnBlue: {
    backgroundColor: BLUE,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  funnelBtnBlueText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  funnelBtnGreen: {
    borderWidth: 2,
    borderColor: '#25D366',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  funnelBtnGreenText: {
    color: '#25D366',
    fontSize: 15,
    fontWeight: '700',
  },

  // Contact
  contactSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#2e2d28',
    marginTop: 8,
  },
  contactTitle: {
    color: '#ffffff',
    fontSize: 16,
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
});
