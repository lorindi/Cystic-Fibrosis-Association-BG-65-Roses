import { AuthenticationError } from '../utils/errors';
import { UserRole, UserGroup } from '../../types/user.types';
import { BlogPost, Comment } from '../../models/content.model';
import { ContextType, checkAuth, checkPermissions } from '../utils/auth';

export const blogResolvers = {
  Query: {
    getBlogPosts: async (
      _: unknown,
      { limit, offset, noLimit }: { limit?: number; offset?: number; noLimit?: boolean }
    ) => {
      try {
        let query = BlogPost.find()
          .populate('author')
          .populate({
            path: 'comments',
            populate: { path: 'author' }
          })
          .sort({ createdAt: -1 });
        
        // Прилагаме пагинация, само ако noLimit не е true
        if (!noLimit) {
          if (offset !== undefined) {
            query = query.skip(offset);
          }
          
          if (limit !== undefined) {
            query = query.limit(limit);
          }
        }
        
        return await query;
      } catch (err) {
        throw new Error('Error fetching blog posts');
      }
    },
    
    getBlogPost: async (_: unknown, { id }: { id: string }) => {
      try {
        const post = await BlogPost.findById(id)
          .populate('author')
          .populate({
            path: 'comments',
            populate: { path: 'author' }
          });
          
        if (!post) {
          throw new Error('Blog post not found');
        }
        
        return post;
      } catch (err) {
        throw new Error('Error fetching blog post');
      }
    }
  },

  Mutation: {
    createBlogPost: async (
      _: unknown, 
      { input }: { input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      try {
        const newPost = new BlogPost({
          ...input,
          author: user.id,
          approved: user.role === UserRole.ADMIN || 
                    (user.groups && user.groups.includes(UserGroup.BLOG))
        });
        
        const savedPost = await newPost.save();
        return await BlogPost.findById(savedPost._id)
          .populate('author')
          .populate({
            path: 'comments',
            populate: { path: 'author' }
          });
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error creating blog post: ${err.message}`);
        }
        throw new Error('Unexpected error during blog post creation');
      }
    },
    
    updateBlogPost: async (
      _: unknown, 
      { id, input }: { id: string; input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      try {
        const post = await BlogPost.findById(id);
        if (!post) {
          throw new Error('Blog post not found');
        }
        
        // Проверка дали потребителят е автор на поста или админ/в група блог
        if (post.author.toString() !== user.id && 
            user.role !== UserRole.ADMIN && 
            (!user.groups || !user.groups.includes(UserGroup.BLOG))) {
          throw new AuthenticationError('You do not have permission to edit this post');
        }
        
        // Ако потребителят не е админ и не е в група блог, постът остава неодобрен след редактиране
        const approved = user.role === UserRole.ADMIN || 
                        (user.groups && user.groups.includes(UserGroup.BLOG)) 
                        ? post.approved : false;
        
        const updatedPost = await BlogPost.findByIdAndUpdate(
          id,
          { ...input, approved },
          { new: true, runValidators: true }
        )
          .populate('author')
          .populate({
            path: 'comments',
            populate: { path: 'author' }
          });
          
        return updatedPost;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error updating blog post: ${err.message}`);
        }
        throw new Error('Unexpected error during blog post update');
      }
    },
    
    deleteBlogPost: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      
      try {
        const post = await BlogPost.findById(id);
        if (!post) {
          throw new Error('Blog post not found');
        }
        
        // Проверка дали потребителят е автор на поста или админ/в група блог
        if (post.author.toString() !== user.id && 
            user.role !== UserRole.ADMIN && 
            (!user.groups || !user.groups.includes(UserGroup.BLOG))) {
          throw new AuthenticationError('You do not have permission to delete this post');
        }
        
        // Изтриване на всички коментари свързани с поста
        await Comment.deleteMany({ _id: { $in: post.comments } });
        
        // Изтриване на самия пост
        await BlogPost.findByIdAndDelete(id);
        
        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error deleting blog post: ${err.message}`);
        }
        throw new Error('Unexpected error during blog post deletion');
      }
    },
    
    approveBlogPost: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      // Само админи и потребители от група блог могат да одобряват публикации
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.BLOG))) {
        throw new AuthenticationError('You do not have permission to approve blog posts');
      }
      
      try {
        const post = await BlogPost.findById(id);
        if (!post) {
          throw new Error('Blog post not found');
        }
        
        const updatedPost = await BlogPost.findByIdAndUpdate(
          id,
          { approved: true },
          { new: true }
        )
          .populate('author')
          .populate({
            path: 'comments',
            populate: { path: 'author' }
          });
          
        return updatedPost;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error approving blog post: ${err.message}`);
        }
        throw new Error('Unexpected error during blog post approval');
      }
    },
    
    addComment: async (
      _: unknown, 
      { input }: { input: { content: string; postId: string } }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      try {
        const post = await BlogPost.findById(input.postId);
        if (!post) {
          throw new Error('Blog post not found');
        }
        
        // Създаване и запазване на коментар
        const newComment = new Comment({
          content: input.content,
          author: user.id
        });
        
        const savedComment = await newComment.save();
        
        // Добавяне на коментара към поста
        post.comments.push(savedComment._id);
        await post.save();
        
        return await Comment.findById(savedComment._id).populate('author');
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error adding comment: ${err.message}`);
        }
        throw new Error('Unexpected error during comment addition');
      }
    },
    
    deleteComment: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      
      try {
        const comment = await Comment.findById(id);
        if (!comment) {
          throw new Error('Comment not found');
        }
        
        // Проверка дали потребителят е автор на коментара или админ
        if (comment.author.toString() !== user.id && user.role !== UserRole.ADMIN) {
          throw new AuthenticationError('You do not have permission to delete this comment');
        }
        
        // Премахване на коментара от поста
        await BlogPost.updateOne(
          { comments: id },
          { $pull: { comments: id } }
        );
        
        // Изтриване на коментара
        await Comment.findByIdAndDelete(id);
        
        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error deleting comment: ${err.message}`);
        }
        throw new Error('Unexpected error during comment deletion');
      }
    }
  }
};