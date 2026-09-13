import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SCHEDULE_ALL, CalDay, CalClass } from '../../../shared/content/data';

const DARK = '#1d1c18';
const GOLD = '#FCD116';

const FILTERS = ['All', 'Stone Town', 'Kiwengwa', 'Jambiani', 'Fumba'];

function ClassCard({ cls }: { cls: CalClass }) {
  return (
    <View
      style={[
        styles.classCard,
        { backgroundColor: cls.bg, borderLeftColor: cls.border },
      ]}
    >
      <View style={styles.classCardLeft}>
        <Text style={[styles.classTitle, { color: cls.color }]}>
          {cls.title}
        </Text>
        <Text style={[styles.classLoc, { color: cls.color }]}>{cls.loc}</Text>
      </View>
      <Text style={[styles.classTime, { color: cls.color }]}>{cls.time}</Text>
    </View>
  );
}

function DayRow({ day, filter }: { day: CalDay; filter: string }) {
  const classes =
    filter === 'All'
      ? day.classes
      : day.classes.filter((c) =>
          c.loc.toLowerCase().includes(filter.toLowerCase()),
        );

  if (classes.length === 0 && filter !== 'All') return null;

  return (
    <View style={styles.dayRow}>
      <View style={styles.dayLabel}>
        <Text style={styles.dayName}>{day.name}</Text>
      </View>
      <View style={styles.dayClasses}>
        {classes.length === 0 ? (
          <View style={styles.restCard}>
            <Text style={styles.restText}>Rest day</Text>
          </View>
        ) : (
          classes.map((cls, i) => <ClassCard key={i} cls={cls} />)
        )}
      </View>
    </View>
  );
}

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Screen header */}
      <View style={styles.screenHeader}>
        <Text style={styles.kicker}>Train with us</Text>
        <Text style={styles.pageTitle}>Class Schedule</Text>
        <Text style={styles.pageSub}>
          Adult and kids classes every week at four locations. Just show up 10
          minutes early — gis available to borrow.
        </Text>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.chip,
              activeFilter === f && styles.chipActive,
            ]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.chipText,
                activeFilter === f && styles.chipTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#a5dcf3' }]} />
          <Text style={styles.legendLabel}>Adults</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f2dd7a' }]} />
          <Text style={styles.legendLabel}>Kids</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#a7d9bd' }]} />
          <Text style={styles.legendLabel}>Family</Text>
        </View>
      </View>

      {/* Schedule list */}
      <ScrollView
        style={styles.scheduleScroll}
        contentContainerStyle={styles.scheduleContent}
        showsVerticalScrollIndicator={false}
      >
        {SCHEDULE_ALL.map((day) => (
          <DayRow key={day.name} day={day} filter={activeFilter} />
        ))}

        {/* Fumba coming soon note */}
        {(activeFilter === 'All' || activeFilter === 'Fumba') && (
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonBadge}>NEW</Text>
            <Text style={styles.comingSoonText}>
              Fumba Town — schedule announced soon.
            </Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK,
  },

  screenHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
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
    marginBottom: 6,
  },
  pageSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    lineHeight: 19,
  },

  // Filter chips
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3a3930',
    backgroundColor: '#252420',
  },
  chipActive: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  chipText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: DARK,
  },

  // Legend
  legend: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },

  // Schedule
  scheduleScroll: {
    flex: 1,
  },
  scheduleContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  dayRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  dayLabel: {
    width: 48,
    paddingTop: 10,
  },
  dayName: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dayClasses: {
    flex: 1,
    gap: 6,
  },

  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderLeftWidth: 3,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  classCardLeft: {
    flex: 1,
  },
  classTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  classLoc: {
    fontSize: 12,
    opacity: 0.75,
  },
  classTime: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },

  restCard: {
    borderRadius: 8,
    backgroundColor: '#252420',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  restText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
    fontStyle: 'italic',
  },

  comingSoon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#252420',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  comingSoonBadge: {
    backgroundColor: GOLD,
    color: DARK,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  comingSoonText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    flex: 1,
  },
});
