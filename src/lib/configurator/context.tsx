import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_CONFIGURATION,
  OPACITY_OPTIONS,
  type Configuration,
  type Fabric,
  type OpacityId,
  type ProductId,
} from "./types";

type ConfiguratorContextValue = {
  configuration: Configuration;
  setProduct: (p: ProductId) => void;
  setFabric: (f: Fabric) => void;
  setOpacity: (o: OpacityId) => void;
  /** Bumps every time the user clicks "Quote this configuration", so the
   * Contact form can react and prefill itself. */
  submissionToken: number;
  submit: () => void;
};

const ConfiguratorContext = createContext<ConfiguratorContextValue | null>(null);

export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const [configuration, setConfiguration] = useState<Configuration>(DEFAULT_CONFIGURATION);
  const [submissionToken, setSubmissionToken] = useState(0);

  const setProduct = useCallback((product: ProductId) => {
    setConfiguration((prev) => {
      // If the current opacity isn't available for the new product, fall back
      // to the first opacity option for that product.
      const allowed = OPACITY_OPTIONS[product];
      const opacity = allowed.includes(prev.opacity) ? prev.opacity : allowed[0]!;
      return { ...prev, product, opacity };
    });
  }, []);

  const setFabric = useCallback((fabric: Fabric) => {
    setConfiguration((prev) => ({ ...prev, fabric }));
  }, []);

  const setOpacity = useCallback((opacity: OpacityId) => {
    setConfiguration((prev) => ({ ...prev, opacity }));
  }, []);

  const submit = useCallback(() => {
    setSubmissionToken((t) => t + 1);
  }, []);

  const value = useMemo(
    () => ({ configuration, setProduct, setFabric, setOpacity, submissionToken, submit }),
    [configuration, setProduct, setFabric, setOpacity, submissionToken, submit],
  );

  return (
    <ConfiguratorContext.Provider value={value}>{children}</ConfiguratorContext.Provider>
  );
}

export function useConfigurator() {
  const ctx = useContext(ConfiguratorContext);
  if (!ctx) {
    throw new Error("useConfigurator must be used inside a ConfiguratorProvider");
  }
  return ctx;
}
