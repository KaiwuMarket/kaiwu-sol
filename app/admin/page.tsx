"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  Settings,
  Package,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarketplace } from "@/hooks/use-marketplace";
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
  const wallet = useWallet();
  const { connected, publicKey } = wallet || { connected: false, publicKey: null };
  const { initConfig, intakeItem, redeemConfirm } = useMarketplace();
  const { toast } = useToast();

  const [isInitializing, setIsInitializing] = useState(false);
  const [isIntaking, setIsIntaking] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // 管理员地址检查 (实际应用中应该从合约配置中获取)
  const isAdmin =
    connected && publicKey?.toString() === "YOUR_ADMIN_ADDRESS_HERE";

  const handleInitConfig = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsInitializing(true);

    try {
      const formData = new FormData(e.currentTarget);
      const feeBps = Number.parseInt(formData.get("feeBps") as string);
      const treasury = new PublicKey(formData.get("treasury") as string);
      const governance = new PublicKey(formData.get("governance") as string);

      await initConfig(feeBps, treasury, governance);

      toast({
        title: "Config Initialized Successfully!",
        description: "The marketplace configuration has been set up.",
      });

      e.currentTarget.reset();
    } catch (error: any) {
      toast({
        title: "Initialization Failed",
        description: error.message || "Failed to initialize config",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleIntakeItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsIntaking(true);

    try {
      const formData = new FormData(e.currentTarget);
      const itemId = Number.parseInt(formData.get("itemId") as string);
      const sku = formData.get("sku") as string;
      const vault = formData.get("vault") as string;
      const initialOwner = new PublicKey(
        formData.get("initialOwner") as string
      );

      await intakeItem(itemId, sku, vault, initialOwner);

      toast({
        title: "Item Intaked Successfully!",
        description: `Item #${itemId} has been added to the vault.`,
      });

      e.currentTarget.reset();
    } catch (error: any) {
      toast({
        title: "Intake Failed",
        description: error.message || "Failed to intake item",
        variant: "destructive",
      });
    } finally {
      setIsIntaking(false);
    }
  };

  const handleRedeemConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsConfirming(true);

    try {
      const formData = new FormData(e.currentTarget);
      const itemId = Number.parseInt(formData.get("itemId") as string);
      const warehouseRef = formData.get("warehouseRef") as string;

      await redeemConfirm(itemId, warehouseRef);

      toast({
        title: "Redemption Confirmed!",
        description: `Item #${itemId} has been shipped.`,
      });

      e.currentTarget.reset();
    } catch (error: any) {
      toast({
        title: "Confirmation Failed",
        description: error.message || "Failed to confirm redemption",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  if (!connected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <Settings className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Please connect your wallet to access admin functions.
          </p>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access admin functions.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Connected: {publicKey?.toString().slice(0, 8)}...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage marketplace configuration and operations
        </p>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList>
          <TabsTrigger value="config">Initialize Config</TabsTrigger>
          <TabsTrigger value="intake">Intake Items</TabsTrigger>
          <TabsTrigger value="redeem">Confirm Redemptions</TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <Card className="p-6 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">
              Initialize Marketplace Config
            </h2>
            <p className="text-muted-foreground mb-6">
              This should only be done once when setting up the marketplace for
              the first time.
            </p>
            <form onSubmit={handleInitConfig} className="space-y-4">
              <div>
                <Label htmlFor="feeBps">
                  Fee Basis Points (e.g., 250 = 2.5%)
                </Label>
                <Input
                  id="feeBps"
                  type="number"
                  placeholder="250"
                  required
                  min="0"
                  max="10000"
                />
              </div>
              <div>
                <Label htmlFor="treasury">Treasury Address</Label>
                <Input
                  id="treasury"
                  placeholder="Enter treasury wallet address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="governance">Governance Address</Label>
                <Input
                  id="governance"
                  placeholder="Enter governance wallet address"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isInitializing}
              >
                {isInitializing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4 mr-2" />
                    Initialize Config
                  </>
                )}
              </Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="intake">
          <Card className="p-6 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Intake New Item</h2>
            <p className="text-muted-foreground mb-6">
              Add a new physical item to the vault and assign it to an owner.
            </p>
            <form onSubmit={handleIntakeItem} className="space-y-4">
              <div>
                <Label htmlFor="itemId">Item ID</Label>
                <Input id="itemId" type="number" placeholder="12345" required />
              </div>
              <div>
                <Label htmlFor="sku">SKU / Item Code</Label>
                <Input id="sku" placeholder="e.g., PSA-12345" required />
              </div>
              <div>
                <Label htmlFor="vault">Vault Location</Label>
                <Input id="vault" placeholder="e.g., Vault A-123" required />
              </div>
              <div>
                <Label htmlFor="initialOwner">Initial Owner Address</Label>
                <Input
                  id="initialOwner"
                  placeholder="Enter owner wallet address"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isIntaking}>
                {isIntaking ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4 mr-2" />
                    Intake Item
                  </>
                )}
              </Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="redeem">
          <Card className="p-6 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Confirm Redemption</h2>
            <p className="text-muted-foreground mb-6">
              Confirm that a physical item has been shipped to the owner.
            </p>
            <form onSubmit={handleRedeemConfirm} className="space-y-4">
              <div>
                <Label htmlFor="redeemItemId">Item ID</Label>
                <Input
                  id="redeemItemId"
                  type="number"
                  placeholder="12345"
                  required
                />
              </div>
              <div>
                <Label htmlFor="warehouseRef">Warehouse Reference</Label>
                <Input
                  id="warehouseRef"
                  placeholder="e.g., SHIP-2024-001"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isConfirming}>
                {isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Redemption
                  </>
                )}
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
