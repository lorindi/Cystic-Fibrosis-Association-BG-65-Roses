import { AuthenticationError } from '../utils/errors';
import { UserRole, UserGroup } from '../../types/user.types';
import { Recipe } from '../../models/content.model';
import { ContextType, checkAuth, checkPermissions } from '../utils/auth';

export const recipeResolvers = {
  Query: {
    getRecipes: async () => {
      try {
        return await Recipe.find()
          .populate('author')
          .sort({ createdAt: -1 });
      } catch (err) {
        throw new Error('Error fetching recipes');
      }
    },
    
    getRecipe: async (_: unknown, { id }: { id: string }) => {
      try {
        const recipe = await Recipe.findById(id).populate('author');
        if (!recipe) {
          throw new Error('Recipe not found');
        }
        return recipe;
      } catch (err) {
        throw new Error('Error fetching recipe');
      }
    }
  },

  Mutation: {
    createRecipe: async (
      _: unknown, 
      { input }: { input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      // Всички потребители могат да създават рецепти, но те изискват одобрение
      
      try {
        const newRecipe = new Recipe({
          ...input,
          author: user.id,
          approved: user.role === UserRole.ADMIN || 
                    (user.groups && user.groups.includes(UserGroup.RECIPES))
        });
        
        const savedRecipe = await newRecipe.save();
        return await Recipe.findById(savedRecipe._id).populate('author');
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error creating recipe: ${err.message}`);
        }
        throw new Error('Unexpected error during recipe creation');
      }
    },
    
    updateRecipe: async (
      _: unknown, 
      { id, input }: { id: string; input: any }, 
      context: ContextType
    ) => {
      const user = checkAuth(context);
      
      try {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
          throw new Error('Recipe not found');
        }
        
        // Проверка дали потребителят е автор на рецептата или админ/в група рецепти
        if (recipe.author.toString() !== user.id && 
            user.role !== UserRole.ADMIN && 
            (!user.groups || !user.groups.includes(UserGroup.RECIPES))) {
          throw new AuthenticationError('You do not have permission to edit this recipe');
        }
        
        // Ако потребителят не е админ и не е в група рецепти, рецептата остава неодобрена след редактиране
        const approved = user.role === UserRole.ADMIN || 
                        (user.groups && user.groups.includes(UserGroup.RECIPES)) 
                        ? recipe.approved : false;
        
        const updatedRecipe = await Recipe.findByIdAndUpdate(
          id,
          { ...input, approved },
          { new: true, runValidators: true }
        ).populate('author');
          
        return updatedRecipe;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error updating recipe: ${err.message}`);
        }
        throw new Error('Unexpected error during recipe update');
      }
    },
    
    deleteRecipe: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      
      try {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
          throw new Error('Recipe not found');
        }
        
        // Проверка дали потребителят е автор на рецептата или админ/в група рецепти
        if (recipe.author.toString() !== user.id && 
            user.role !== UserRole.ADMIN && 
            (!user.groups || !user.groups.includes(UserGroup.RECIPES))) {
          throw new AuthenticationError('You do not have permission to delete this recipe');
        }
        
        await Recipe.findByIdAndDelete(id);
        return true;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error deleting recipe: ${err.message}`);
        }
        throw new Error('Unexpected error during recipe deletion');
      }
    },
    
    approveRecipe: async (_: unknown, { id }: { id: string }, context: ContextType) => {
      const user = checkAuth(context);
      // Само админи и потребители от група рецепти могат да одобряват рецепти
      if (user.role !== UserRole.ADMIN && (!user.groups || !user.groups.includes(UserGroup.RECIPES))) {
        throw new AuthenticationError('You do not have permission to approve recipes');
      }
      
      try {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
          throw new Error('Recipe not found');
        }
        
        const updatedRecipe = await Recipe.findByIdAndUpdate(
          id,
          { approved: true },
          { new: true }
        ).populate('author');
          
        return updatedRecipe;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(`Error approving recipe: ${err.message}`);
        }
        throw new Error('Unexpected error during recipe approval');
      }
    }
  }
};