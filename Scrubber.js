import React, { Component } from 'react';
import {
  View,
  Dimensions,
  FlatList,
  NativeModules,
  PanResponder,
  StyleSheet
} from 'react-native';
import { requireNativeComponent } from 'react-native';

const CachedImage = requireNativeComponent('CachedImage');

const THUMB_MARGIN = 6;
const THUMB_SIZE = 44;
const THUMB_FULL_SIZE = THUMB_SIZE + THUMB_MARGIN;
// 11 is the room needed for the unread blue dot
const SCRUBBER_HEIGHT = THUMB_SIZE + 14 * 2;

const OFFSET = (Dimensions.get('window').width - THUMB_SIZE) / 2;

const HEADER_VIEW = (
  <View
    style={{
      // 9 because the last item has a marginRight of 6 so we need to
      // account for that plus an addition 3 for the tile border
      width: OFFSET,
      height: 50
    }}
  />
);

const FOOTER_VIEW = (
  <View
    style={{
      // It needs to be offset by 3 because of the tile border width
      width: OFFSET,
      height: 50
    }}
  />
);

class Scrubber extends Component {
  componentDidMount() {
    const { messages, currentMessageIndex } = this.props;
    console.log('hi', messages.length, currentMessageIndex);
    this._list.scrollToIndex({
      index: messages.length - currentMessageIndex,
      animated: false
    });
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (e, gesture) => {
        if (gesture.dx === 0 && gesture.dy === 0 && !this._scrolling) {
          this.props.onTouch(e.nativeEvent.pageX);
        }
      }
    });
  }

  componentDidUpdate(prevProps) {
    const prevScrollIndex =
      prevProps.messages.length - prevProps.currentMessageIndex;
    const currentScrollIndex =
      this.props.messages.length - this.props.currentMessageIndex;

    console.log(prevScrollIndex, currentScrollIndex);

    if (prevScrollIndex !== currentScrollIndex) {
      console.log('moving');
      if (!this._scrolling) {
        const animated = this.props.messages === prevProps.messages;
        console.log('calling this._list.scrollToIndex', animated);
        this._list.scrollToIndex({
          index: currentScrollIndex,
          animated
        });
      }
    }
  }

  onScrollEnd(e) {
    const { messages, conversation } = this.props;
    const x = Math.min(
      e.nativeEvent.contentOffset.x,
      messages.length * THUMB_FULL_SIZE
    );

    if (x % THUMB_FULL_SIZE === 0 && this._scrolling) {
      const idx = (x / THUMB_FULL_SIZE) | 0;

      // The items are rendered in reverse, so we need to reverse the
      // index. The reason we don't use `messages.length - 1` is
      // because the reply screen is added to the list so we want to
      // account for an extra item.
      const realIdx = messages.length - idx;
    }
  }

  scroll = e => {
    const x = e.nativeEvent.contentOffset.x;
    const lastIndex = Math.floor(this.lastOffsetX / THUMB_FULL_SIZE);
    const currentIndex = Math.floor(x / THUMB_FULL_SIZE);
    // selection changed only if we cross the threshold to new index and we didn't
    // just play a vibration
    if (lastIndex !== currentIndex && currentIndex !== this.lastIndexCrossed) {
      this.lastIndexCrossed = currentIndex;
    }
    this.lastOffsetX = x;
  };

  getItemLayout(data, index) {
    return {
      length: THUMB_FULL_SIZE,
      offset: THUMB_FULL_SIZE * index,
      index
    };
  }

  render() {
    const { messages, currentMessageIndex, style } = this.props;
    const items = messages;
    const initialScrollIndex = items.length - 1 - currentMessageIndex;

    return (
      <View
        style={{
          alignItems: 'center',
          flex: 1
        }}
      >
        <View style={styles.background} />
        <FlatList
          ref={el => (this._list = el)}
          {...this.panResponder.panHandlers}
          data={items}
          horizontal={true}
          inverted={true}
          removeClippedSubviews={false}
          showsHorizontalScrollIndicator={false}
          snapToInterval={THUMB_FULL_SIZE}
          scrollEventThrottle={81}
          onScroll={this.scroll}
          snapToAlignment="start"
          decelerationRate="fast"
          updateCellsBatchingPeriod={15}
          ListHeaderComponent={HEADER_VIEW}
          ListFooterComponent={FOOTER_VIEW}
          initialNumToRender={initialScrollIndex + 10}
          getItemLayout={this.getItemLayout}
          onMomentumScrollEnd={e => {
            this.onScrollEnd(e);
            this._scrolling = false;
          }}
          onScrollBeginDrag={() => (this._scrolling = true)}
          renderItem={({ index: invertedIndex }) => {
            const index = items.length - 1 - invertedIndex;
            const item = items[index];

            return (
              <View style={[styles.thumb, { backgroundColor: item.color }]}>
                <CachedImage
                  style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
                  source="https://griffonagedotcom.files.wordpress.com/2016/07/profile-modern-2e.jpg"
                />
              </View>
            );
          }}
          keyExtractor={(_, index) => {
            const item = items[items.length - 1 - index];
            return item.key || item.id || item.client_id;
          }}
          style={styles.list}
        />
        <View
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderWidth: 4,
            borderColor: 'white'
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    height: SCRUBBER_HEIGHT
  },
  tile: {
    marginTop: 7
  },
  list: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 2,
    borderColor: 'red'
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    marginLeft: THUMB_MARGIN
  }
});

export default Scrubber;
