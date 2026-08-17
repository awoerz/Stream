export type StreamBridge = Window["stream"];

export type WorkflowStatus = Awaited<ReturnType<StreamBridge["getWorkflowStatus"]>>;
export type WorkflowInitializationResult = Awaited<
  ReturnType<StreamBridge["initializeWorkflow"]>
>;
export type TaskSaveResult = Awaited<ReturnType<StreamBridge["saveTask"]>>;

export function getStreamMethod<K extends keyof StreamBridge>(
  methodName: K
): StreamBridge[K] {
  const stream = window.stream;
  const method = stream?.[methodName];

  if (typeof method !== "function") {
    throw new Error(
      `The Stream bridge is missing the required method: ${String(methodName)}. Reload or restart the app and try again.`
    );
  }

  return method;
}
