import { boolean, number, object, string, type TypeOf } from "zod";

const createPayload = {
	body: object({
		// postId: string({
		//   required_error: "postId is required",
		// }),
		status: string({
			required_error: "status is required",
		}),
		visibility: string({
			required_error: "visibility is required",
		}),
		title: string({
			required_error: "title is required",
		}).max(500, "Title is too long"),
		subtitle: string({
			required_error: "subtitle is required",
		}).max(500, "Subtitle is too long"),
		categoryId: string({
			required_error: "categoryId is required",
		}),
		postTypeId: string({
			required_error: "postTypeId is required",
		}),
		tags: string({
			required_error: "tags is required",
		}).max(500, "tags string is too long"),
		urlSlug: string({
			required_error: "urlSlug is required",
		}).max(500, "urlSlug string is too long"),
		authorId: string({
			required_error: "authorId is required",
		}),
		allowSharing: boolean({
			required_error: "allowSharing is required",
		}),
		allowComments: boolean({
			required_error: "allowComments is required",
		}),
		published: string({
			required_error: "published is required",
		}),
		content: string({
			required_error: "content is required",
		}),
		summary: string({
			required_error: "summary is required",
		}).max(2048, "summary is too long"),
		postImages: object({
			imageId: string({
				required_error: "imageId is required",
			}),
			imageUrl: string({
				required_error: "imageUrl is required",
			}),
			// Backend generates this based on the title given
			imageName: string({
				required_error: "imageName is required",
			}),
			imageTitle: string({
				required_error: "imageTitle is required",
			}),
			imageAlt: string({
				required_error: "imageAlt is required",
			}),
		})
			.array()
			.optional(),
		provinceId: number({
			required_error: "provinceId is required",
		}),
		barrioId: number({
			required_error: "barrioId is required",
		}),
		lat: number({
			required_error: "lat is required",
		}).optional(),
		lng: number({
			required_error: "lat is required",
		}).optional(),
		ogTitle: string({
			required_error: "ogTitle is required",
		}).max(60, "ogTitle is too long"),
		ogDescription: string({
			required_error: "ogDescription is required",
		}).max(200, "ogDescription is too long"),
		ogImage: string({
			required_error: "ogImage is required",
		}),

		relatedPlaceId: number({
			required_error: "relatedPlaceId is required",
		}).optional(),
		relatedPostId: string({
			required_error: "relatedPostId is required",
		}).optional(),
		relatedCategoryId: number({
			required_error: "relatedCategoryId is required",
		}).optional(),
	}),
};

const params = {
	params: object({
		postId: string({
			required_error: "postId is required",
		}),
	}),
};

export const createPostSchema = object({
	...createPayload,
});

export const readPostSchema = object({
	...params,
});

export const updatePostSchema = object({
	...createPayload, // maybe they will be different in the future?
	...params,
});

export const deletePostSchema = object({
	...params,
});

export type CreatePostInput = TypeOf<typeof createPostSchema>;
export type ReadPostInput = TypeOf<typeof readPostSchema>;
export type UpdatePostInput = TypeOf<typeof updatePostSchema>;
export type DeletePostInput = TypeOf<typeof deletePostSchema>;
