import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DARK = '#1d1c18';
const GOLD = '#FCD116';
const BLUE = '#00A3DD';

const WA_HREF = 'https://wa.me/+255628031317';
const IG_HREF = 'https://instagram.com/zanzibarbjj';
const FB_HREF = 'https://facebook.com/zanzibarbjj';

type NavSection = {
  title: string;
  items: NavItem[];
};

type NavItem = {
  label: string;
  sublabel?: string;
  onPress: () => void;
  badge?: string;
};

export default function MoreScreen() {
  const insets = useSafeAreaInsets();

  const sections: NavSection[] = [
    {
      title: 'About',
      items: [
        {
          label: 'What is BJJ?',
          sublabel: 'New to Jiu Jitsu? Start here',
          onPress: () =>
            Linking.openURL('https://zanzibarbjj.com/about-bjj'),
        },
        {
          label: 'Kids Program',
          sublabel: 'Ages 4–16 · Three groups',
          onPress: () =>
            Linking.openURL('https://zanzibarbjj.com/kids'),
        },
        {
          label: 'Instructors',
          sublabel: 'Coaches & mentors',
          onPress: () =>
            Linking.openURL('https://zanzibarbjj.com/instructors'),
        },
        {
          label: 'Competitions',
          sublabel: 'Zanzibar Open 2026',
          badge: 'Sep 2026',
          onPress: () =>
            Linking.openURL('https://zanzibarbjj.com/competitions'),
        },
      ],
    },
    {
      title: 'Members',
      items: [
        {
          label: 'Member Portal',
          sublabel: 'Payments, attendance & belt progress',
          onPress: () =>
            Linking.openURL('https://zanzibarbjj.com/portal'),
        },
        {
          label: 'Coach Login',
          sublabel: 'Instructor area',
          onPress: () =>
            Linking.openURL('https://zanzibarbjj.com/coach'),
        },
      ],
    },
    {
      title: 'Contact',
      items: [
        {
          label: 'WhatsApp Us',
          sublabel: '+255 628 031 317',
          onPress: () => Linking.openURL(WA_HREF),
        },
        {
          label: 'Locations & Directions',
          sublabel: 'Stone Town · Kiwengwa · Jambiani · Fumba',
          onPress: () =>
            Linking.openURL(
              'https://www.google.com/maps/search/?api=1&query=Stone+Town+Zanzibar',
            ),
        },
      ],
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.screenHeader}>
          <Text style={styles.pageTitle}>More</Text>
          <Text style={styles.pageSub}>
            Resources, portals and contact options.
          </Text>
        </View>

        {/* Nav sections */}
        {sections.map((section) => (
          <View key={section.title} style={styles.navSection}>
            <Text style={styles.sectionHeader}>{section.title}</Text>
            <View style={styles.navGroup}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.navRow,
                    i < section.items.length - 1 && styles.navRowBorder,
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.navRowLeft}>
                    <Text style={styles.navLabel}>{item.label}</Text>
                    {item.sublabel ? (
                      <Text style={styles.navSub}>{item.sublabel}</Text>
                    ) : null}
                  </View>
                  <View style={styles.navRowRight}>
                    {item.badge ? (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    ) : null}
                    <Text style={styles.arrow}>›</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Social links */}
        <View style={styles.socialSection}>
          <Text style={styles.sectionHeader}>Follow us</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => Linking.openURL(IG_HREF)}
              activeOpacity={0.75}
            >
              <Text style={styles.socialIcon}>📷</Text>
              <Text style={styles.socialLabel}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => Linking.openURL(FB_HREF)}
              activeOpacity={0.75}
            >
              <Text style={styles.socialIcon}>👥</Text>
              <Text style={styles.socialLabel}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => Linking.openURL(WA_HREF)}
              activeOpacity={0.75}
            >
              <Text style={styles.socialIcon}>💬</Text>
              <Text style={styles.socialLabel}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTag}>
            Oss. Everyone starts as a white belt.
          </Text>
          <Text style={styles.footerLineage}>
            Lineage: Atlanta Top Team, USA
          </Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://zanzibarbjj.com/privacy')
              }
            >
              <Text style={styles.footerLink}>Privacy policy</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>·</Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://zanzibarbjj.com/terms')
              }
            >
              <Text style={styles.footerLink}>Terms</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>·</Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://zanzibarbjj.com/safeguarding')
              }
            >
              <Text style={styles.footerLink}>Safeguarding</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.footerCopy}>
            © 2026 Zanzibar BJJ · Roan Jucao Association
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK,
  },
  content: {
    paddingBottom: 16,
  },

  screenHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  pageSub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },

  // Nav sections
  navSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    color: GOLD,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  navGroup: {
    backgroundColor: '#252420',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2e2d28',
    overflow: 'hidden',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  navRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#2e2d28',
  },
  navRowLeft: {
    flex: 1,
    marginRight: 12,
  },
  navLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  navSub: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    lineHeight: 17,
  },
  navRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: 'rgba(252,209,22,0.15)',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: 'rgba(252,209,22,0.3)',
  },
  badgeText: {
    color: GOLD,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  arrow: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 22,
  },

  // Social
  socialSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialBtn: {
    flex: 1,
    backgroundColor: '#252420',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2e2d28',
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
  },
  socialIcon: {
    fontSize: 22,
  },
  socialLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '600',
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#2e2d28',
    alignItems: 'center',
  },
  footerTag: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 6,
  },
  footerLineage: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    marginBottom: 14,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  footerLink: {
    color: BLUE,
    fontSize: 12,
  },
  footerDot: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
  },
  footerCopy: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 11,
    textAlign: 'center',
  },
});
