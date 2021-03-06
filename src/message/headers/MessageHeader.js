import React from 'react';
import { StyleSheet } from 'react-native';

import { isStreamNarrow, isTopicNarrow, isPrivateNarrow, isGroupNarrow } from '../../utils/narrow';
import TopicMessageHeader from './TopicMessageHeader';
import StreamMessageHeader from './StreamMessageHeader';
import PrivateMessageHeader from './PrivateMessageHeader';

const styles = StyleSheet.create({
  margin: {
    marginTop: 4,
    marginBottom: 4,
  },
});

export default class MessageHeader extends React.PureComponent {

  props: {
    auth: Object,
    item: Object,
    subscriptions: any[],
    narrow: () => {},
  }

  render() {
    const { item, subscriptions, auth, narrow, doNarrow } = this.props;

    if (isStreamNarrow(narrow)) {
      return (
        <TopicMessageHeader
          key={`section_${item.id}`}
          itemId={item.id}
          stream={item.display_recipient}
          topic={item.subject}
          doNarrow={doNarrow}
          customStyle={styles.margin}
        />
      );
    }

    if (item.type === 'stream') {
      const stream = subscriptions
        .find(x => x.name === item.display_recipient);

      return (
        <StreamMessageHeader
          key={`section_${item.id}`}
          isPrivate={stream && stream.invite_only}
          isMuted={stream && !stream.in_home_view}
          stream={item.display_recipient}
          topic={item.subject}
          color={stream ? stream.color : '#ccc'}
          itemId={item.id}
          doNarrow={doNarrow}
          customStyle={styles.margin}
        />
      );
    }

    if (item.type === 'private' &&
      !isPrivateNarrow(narrow) && !isGroupNarrow(narrow) && !isTopicNarrow(narrow)) {
      const recipients = item.display_recipient.length > 1 ?
        item.display_recipient.filter(r => r.email !== auth.email) :
        item.display_recipient;
      return (
        <PrivateMessageHeader
          key={`section_${item.id}`}
          recipients={recipients}
          itemId={item.id}
          doNarrow={doNarrow}
          customStyle={styles.margin}
        />
      );
    }

    return null;
  }
}
