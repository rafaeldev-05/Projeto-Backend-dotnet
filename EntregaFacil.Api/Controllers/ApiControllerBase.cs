using EntregaFacil.Api.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace EntregaFacil.Api.Controllers;

public abstract class ApiControllerBase : ControllerBase
{
    protected ActionResult HandleException(Exception exception)
    {
        return exception switch
        {
            KeyNotFoundException => NotFound(new ApiErrorResponse(exception.Message)),
            InvalidOperationException => BadRequest(new ApiErrorResponse(exception.Message)),
            _ => StatusCode(StatusCodes.Status500InternalServerError, new ApiErrorResponse("Unexpected error."))
        };
    }
}
