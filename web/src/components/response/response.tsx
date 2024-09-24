// Import necessary types and components
import { ResponsesType, FieldResponseType } from "@/data/types";

type ResponseProps = {
  response: ResponsesType;
};

// Utility function to render individual field response based on its type
const renderFieldResponse = (fieldResponse: FieldResponseType) => {
  if (typeof fieldResponse.response === 'object') {
    return (
      <div className="bg-gray-100 p-2 rounded-md">
        {Object.entries(fieldResponse.response).map(([key, value], index) => (
          <div key={index} className="mb-1">
            <span className="font-medium">{key}:</span> <span>{JSON.stringify(value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return <p className="bg-gray-100 p-2 rounded-md">{fieldResponse.response}</p>;
};

const Response = ({ response }: ResponseProps) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-4 border border-gray-200">
      {/* Response Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-lg font-semibold text-gray-800">Response ID: {response.id}</div>
          <div className="text-sm text-gray-500">Submitted on: {new Date(response.submittedAt).toLocaleString()}</div>
        </div>
        {response.userId && (
          <div className="text-sm text-gray-500">
            <span className="font-medium">User ID:</span> {response.userId}
          </div>
        )}
      </div>
      
      {/* Field Responses */}
      <div className="space-y-4">
        {response.fieldResponses.map((fieldResponse, index) => (
          <div key={index} className="bg-gray-50 border border-gray-200 p-4 rounded-md">
            <div className="text-sm text-gray-700 mb-2">
              <span className="font-medium">{fieldResponse.label}</span> 
            </div>
            {renderFieldResponse(fieldResponse)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Response;
