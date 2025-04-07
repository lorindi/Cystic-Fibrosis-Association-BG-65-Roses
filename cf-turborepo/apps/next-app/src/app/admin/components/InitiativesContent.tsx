"use client";

import * as React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Initiative } from "@/types/initiative";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  InitiativesTable,
  InitiativeFormModal,
  InitiativeItemsTable,
} from "../features/initiatives/components";
import {
  GET_INITIATIVES,
  GET_INITIATIVE,
  CREATE_INITIATIVE,
  UPDATE_INITIATIVE,
  DELETE_INITIATIVE,
  ADD_INITIATIVE_ITEM,
  DELETE_INITIATIVE_ITEM,
} from "../graphql/initiatives";

export default function InitiativesContent() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedInitiative, setSelectedInitiative] = React.useState<Initiative | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [initiativeToDelete, setInitiativeToDelete] = React.useState<Initiative | undefined>();
  
  // Item management states
  const [isItemDeleteDialogOpen, setIsItemDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<string | undefined>();
  const [currentInitiativeId, setCurrentInitiativeId] = React.useState<string | undefined>();
  
  // Tab state
  const [activeTab, setActiveTab] = React.useState("initiatives");

  // Pagination states
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [totalInitiatives, setTotalInitiatives] = React.useState(0);

  // Calculate max page
  const maxPage = Math.ceil(totalInitiatives / itemsPerPage) || 1;

  // Load initiatives
  const { loading, error, data } = useQuery(GET_INITIATIVES, {
    variables: {
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
    },
    fetchPolicy: "network-only",
  });

  // Load current initiative details (when viewing items)
  const {
    data: currentInitiativeData,
    loading: currentInitiativeLoading,
    refetch: refetchCurrentInitiative,
  } = useQuery(GET_INITIATIVE, {
    variables: {
      id: currentInitiativeId || "",
    },
    skip: !currentInitiativeId,
    fetchPolicy: "network-only",
  });

  // Initiative mutations
  const [createInitiative] = useMutation(CREATE_INITIATIVE, {
    refetchQueries: [
      {
        query: GET_INITIATIVES,
        variables: {
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
        },
      },
    ],
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Initiative created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [updateInitiative] = useMutation(UPDATE_INITIATIVE, {
    refetchQueries: [
      {
        query: GET_INITIATIVES,
        variables: {
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
        },
      },
    ],
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Initiative updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [deleteInitiative] = useMutation(DELETE_INITIATIVE, {
    refetchQueries: [
      {
        query: GET_INITIATIVES,
        variables: {
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
        },
      },
    ],
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Initiative deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [deleteInitiativeItem] = useMutation(DELETE_INITIATIVE_ITEM, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      if (currentInitiativeId) {
        refetchCurrentInitiative();
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= maxPage) {
      setPage(newPage);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setPage(1); // Reset to first page
  };

  // Callbacks
  const handleCreateOrUpdateInitiative = (formData: any, items: any[]) => {
    if (selectedInitiative) {
      // Update existing initiative
      updateInitiative({
        variables: {
          id: selectedInitiative.id,
          input: {
            ...formData,
            items: items.map((item) => ({
              name: item.name,
              description: item.description,
              quantity: item.quantity,
            })),
          },
        },
      });
    } else {
      // Create new initiative
      createInitiative({
        variables: {
          input: {
            ...formData,
            items: items.map((item) => ({
              name: item.name,
              description: item.description,
              quantity: item.quantity,
            })),
          },
        },
      });
    }
  };

  const handleDeleteInitiative = () => {
    if (initiativeToDelete) {
      deleteInitiative({
        variables: {
          id: initiativeToDelete.id,
        },
      });
      setIsDeleteDialogOpen(false);
      setInitiativeToDelete(undefined);
    }
  };

  const handleDeleteItem = () => {
    if (itemToDelete) {
      deleteInitiativeItem({
        variables: {
          itemId: itemToDelete,
        },
      });
      setIsItemDeleteDialogOpen(false);
      setItemToDelete(undefined);
    }
  };

  const initiatives = data?.getInitiatives || [];
  const currentInitiative = currentInitiativeData?.getInitiative;
  const initiativeItems = currentInitiative?.items || [];

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
          {currentInitiativeId && (
            <TabsTrigger value="items">
              {currentInitiative?.title || "Initiative"} Items
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="initiatives">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Initiatives</h1>
            <Button
              onClick={() => {
                setSelectedInitiative(undefined);
                setIsModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Initiative
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-10">Loading initiatives...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              Error loading initiatives: {error.message}
            </div>
          ) : (
            <InitiativesTable
              initiatives={initiatives}
              onEdit={(initiative) => {
                setSelectedInitiative(initiative);
                setIsModalOpen(true);
              }}
              onDelete={(initiative) => {
                setInitiativeToDelete(initiative);
                setIsDeleteDialogOpen(true);
              }}
              onManageItems={(initiative) => {
                setCurrentInitiativeId(initiative.id);
                setActiveTab("items");
              }}
            />
          )}

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Rows per page:
              </span>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {page} of {maxPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= maxPage || initiatives.length < itemsPerPage}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        {currentInitiativeId && (
          <TabsContent value="items">
            <div className="flex justify-between items-center mb-6">
              <div>
                <Button
                  variant="outline"
                  className="mb-4"
                  onClick={() => {
                    setActiveTab("initiatives");
                    setCurrentInitiativeId(undefined);
                  }}
                >
                  Back to Initiatives
                </Button>
                <h1 className="text-3xl font-bold">
                  {currentInitiative?.title || "Initiative"} Items
                </h1>
              </div>
            </div>

            {currentInitiativeLoading ? (
              <div className="text-center py-10">Loading items...</div>
            ) : (
              <InitiativeItemsTable
                items={initiativeItems}
                onDelete={(itemId) => {
                  setItemToDelete(itemId);
                  setIsItemDeleteDialogOpen(true);
                }}
              />
            )}
          </TabsContent>
        )}
      </Tabs>

      {/* Initiative Form Modal */}
      <InitiativeFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedInitiative(undefined);
        }}
        onSubmit={handleCreateOrUpdateInitiative}
        initiative={selectedInitiative}
      />

      {/* Delete Initiative Confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the initiative
              {initiativeToDelete?.title && (
                <span className="font-medium"> "{initiativeToDelete.title}"</span>
              )}{" "}
              and all its related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteInitiative}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Item Confirmation */}
      <AlertDialog
        open={isItemDeleteDialogOpen}
        onOpenChange={setIsItemDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this item and its related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 