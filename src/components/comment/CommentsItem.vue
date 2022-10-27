<template>
  <v-list-item class="pl-0">
    <v-list-item-avatar class="mb-auto">
      <v-img :src="`${baseURL}${comment.sysUser.avatar}`"></v-img>
    </v-list-item-avatar>
    <v-list-item-content class="text-left">
      <v-list-item-subtitle>
        <span>{{comment.sysUser.realname}}</span>
        <span class="ml-2">{{moment(comment.createTime).fromNow()}}</span>
      </v-list-item-subtitle>
      <v-list-item-title class="my-2">
        <span class="text-pre-wrap">{{comment.content}}</span>
      </v-list-item-title>
      <v-list-item-subtitle>
        <span class="mr-2" key="comment-basic-like" style="cursor: pointer;" @click="like">
          <v-icon :size="14" v-if="comment.isThumbUp !== 1">fa fa-thumbs-o-up</v-icon>
          <v-icon :size="14" v-else color="#1976d2">fa fa-thumbs-up</v-icon>
          <span>
            {{ comment.thumbUpNumber }}
          </span>
        </span>
        <span style="cursor: pointer;" class="comment-icon mr-2" @click="showReply">
          <v-icon :size="14">fa fa-commenting-o</v-icon>
          {{comment.bmsCommentList?comment.bmsCommentList.length:0}}
          <span>{{isShowReply === comment.id && (comment.bmsCommentList&& comment.bmsCommentList.length>0)?'收起':''}}</span>
        </span>
        <a key="comment-basic-reply-to" v-if="hasCommentPower" @click="handleReply">{{commentId === comment.id?'取消回复':'回复'}}</a>
        <a class="ml-2" v-if="token && userInfo().id === comment.userId">
          <span class="tag" @click="() => handleDelete(comment.id)">删除</span>
        </a>
        <Reply
          v-if="commentId === comment.id && hasCommentPower"
          :key="comment.id"
          :comment="comment"
          :parentId="comment.id"
          @loadComments="loadComments"
        />
        <template v-if="hasBmsComment && isShowReply === comment.id">
          <ReplyItem
            v-for="(bmsComment,i) in comment.bmsCommentList"
            :key="i"
            :comment="bmsComment"
            :parentId="comment.id"
            :slug="slug"
            :hasCommentPower="hasCommentPower"
            @loadComments="loadComments"
          >
          </ReplyItem>
        </template>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { deleteComment } from '@/api/post'
import { mapGetters } from 'vuex'
import moment from 'moment'
import 'moment/locale/zh-cn'
import ReplyItem from './ReplyItem'
import Reply from './Reply'
import { thumbsUp } from '@/api/post'
export default {
  name: 'LvCommentsItem',
  components: {
    Reply,
    ReplyItem
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    hasCommentPower: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      baseURL: '',
      action: null,
      moment,
      isShowReply: false,
      commentId: '',
      files: [
        {
          color: 'blue',
          icon: 'mdi-clipboard-text',
          subtitle: 'Jan 20, 2014',
          title: 'Vacation itinerary'
        },
        {
          color: 'amber',
          icon: 'mdi-gesture-tap-button',
          subtitle: 'Jan 10, 2014',
          title: 'Kitchen remodel'
        }
      ],
      folders: [
        {
          subtitle: 'Jan 9, 2014',
          title: 'Photos'
        },
        {
          subtitle: 'Jan 17, 2014',
          title: 'Recipes'
        },
        {
          subtitle: 'Jan 28, 2014',
          title: 'Work'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'token', 'user'
    ]),
    hasBmsComment() {
      return this.comment.bmsCommentList && this.comment.bmsCommentList.length
    }
  },
  mounted() {
    this.baseURL = window._CONFIG['staticDomainURL'] + '/'
  },
  methods: {
    ...mapGetters(['userInfo']),
    handleDelete(id) {
      deleteComment({ id: id }).then(value => {
        const { code } = value
        if (code === 200) {
          this.$message.success('删除成功')
          this.$emit('loadComments')
        }
      })
    },
    like() {
      thumbsUp({ id: this.comment.id }).then(res => {
        if (res.code === 200) {
          this.comment.thumbUpNumber = res.data.thumbUpNumber
          this.$emit('loadComments')
        }
      })
    },
    handleReply() {
      this.commentId = this.commentId === this.comment.id ? '' : this.comment.id
      this.$emit('reply', this.comment.id, 'reply')
    },
    loadComments() {
      this.$emit('loadComments')
    },
    showReply() {
      if (this.hasBmsComment) {
        this.isShowReply = this.isShowReply === this.comment.id ? '' : this.comment.id
      }
    }
  }
}
</script>
<style scoped>
.avatar{
  width: 100%;
  height: 100%;
}
.isThumbUp{
  color: #06f;
}
.comment-icon{
  font-size: 14px;
}
</style>
