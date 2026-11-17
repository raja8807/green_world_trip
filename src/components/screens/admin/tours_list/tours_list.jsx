import React, { useState, useMemo, useEffect } from "react";
import CustomContainer from "@/components/ui/custom_container/custom_container";
import { Table, Button, Alert, Form, InputGroup, Pagination, Badge } from "react-bootstrap";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import styles from "./tours_list.module.scss";
import Link from "next/link";
import {
  Trash,
  PencilSquare,
  Plus,
  Search,
  BoxArrowUpRight,
  ArrowCounterclockwise,
  XCircle,
} from "react-bootstrap-icons";
import { getImageUrl } from "@/utils/image";
import { deleteMultipleFilesFromR2 } from "@/utils/r2Upload";

const AdminToursList = ({ initialTours, error }) => {
  const router = useRouter();
  const [tours, setTours] = useState(initialTours || []);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (initialTours) {
      setTours(initialTours);
    }
  }, [initialTours]);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [flagFilter, setFlagFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, flagFilter, sortBy, pageSize]);

  // Filtered and sorted tours
  const filteredTours = useMemo(() => {
    let result = (tours || []).filter((t) => {
      if (!t) return false;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        t.name?.toLowerCase().includes(q) ||
        t.slug?.toLowerCase().includes(q) ||
        t.category_type?.toLowerCase().includes(q) ||
        t.state_country?.toLowerCase().includes(q) ||
        t.region_continent?.toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "" || t.category_type === categoryFilter;

      let flagsObj = t.flags;
      if (typeof flagsObj === "string") {
        try {
          flagsObj = JSON.parse(flagsObj);
        } catch (e) {
          flagsObj = {};
        }
      }

      const matchesFlag =
        flagFilter === "" ||
        (flagFilter === "featured" && Boolean(flagsObj?.is_featured)) ||
        (flagFilter === "trending" && Boolean(flagsObj?.is_trending));

      return matchesSearch && matchesCategory && matchesFlag;
    });

    // Sort result
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sortBy === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      if (sortBy === "name_asc") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sortBy === "name_desc") {
        return (b.name || "").localeCompare(a.name || "");
      }
      return 0;
    });

    return result;
  }, [tours, searchQuery, categoryFilter, flagFilter, sortBy]);

  // Pagination calculations
  const totalItems = filteredTours.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedTours = filteredTours.slice(startIndex, endIndex);

  const isFiltered =
    searchQuery.trim() !== "" ||
    categoryFilter !== "" ||
    flagFilter !== "" ||
    sortBy !== "newest";

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setFlagFilter("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete the tour: "${name}"? This will also remove its images from storage.`)) {
      try {
        const tourToDelete = tours.find((t) => t.id === id);
        const imagesToDelete = [];
        if (tourToDelete?.main_image) imagesToDelete.push(tourToDelete.main_image);
        if (Array.isArray(tourToDelete?.images)) imagesToDelete.push(...tourToDelete.images);

        // Fetch any itinerary images for this tour to delete them as well
        const { data: itinData } = await supabase
          .from("tour_itineraries")
          .select("images")
          .eq("tour_id", id);

        if (itinData) {
          for (const item of itinData) {
            if (Array.isArray(item.images)) {
              imagesToDelete.push(...item.images);
            }
          }
        }

        const { error } = await supabase.from("tours").delete().eq("id", id);
        if (error) {
          setDeleteError(error.message);
        } else {
          if (imagesToDelete.length > 0) {
            await deleteMultipleFilesFromR2(imagesToDelete);
          }
          setTours((prev) => prev.filter((t) => t.id !== id));
        }
      } catch (err) {
        setDeleteError(err.message || "Failed to delete tour and associated files.");
      }
    }
  };

  // Helper to render pagination items with ellipses
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, safeCurrentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === safeCurrentPage}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <div className={styles.adminPage}>
      <CustomContainer>
        <div className={styles.header}>
          <div>
            <h2>Manage Tours</h2>
            <small className="text-muted">
              Total {tours.length} {tours.length === 1 ? "tour" : "tours"} in database
            </small>
          </div>
          <Link href="/admin/tours/new">
            <Button variant="primary" className={styles.addBtn}>
              <Plus size={20} /> Add New Tour
            </Button>
          </Link>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {deleteError && (
          <Alert variant="danger" dismissible onClose={() => setDeleteError("")}>
            {deleteError}
          </Alert>
        )}

        {/* Filter Controls Card */}
        <div className={styles.filterCard}>
          <div className={styles.filterGrid}>
            {/* Search Input */}
            <InputGroup>
              <InputGroup.Text className="bg-white">
                <Search />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by name, location, or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="outline-secondary"
                  onClick={() => setSearchQuery("")}
                  title="Clear search"
                >
                  <XCircle />
                </Button>
              )}
            </InputGroup>

            {/* Category Filter */}
            <Form.Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="domestic">Domestic</option>
              <option value="international">International</option>
              <option value="honeymoon">Honeymoon</option>
              <option value="group">Group</option>
            </Form.Select>

            {/* Flag Filter */}
            <Form.Select
              value={flagFilter}
              onChange={(e) => setFlagFilter(e.target.value)}
            >
              <option value="">All Status / Flags</option>
              <option value="featured">Featured Only</option>
              <option value="trending">Trending Only</option>
            </Form.Select>

            {/* Sort Options */}
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name_asc">Name (A - Z)</option>
              <option value="name_desc">Name (Z - A)</option>
            </Form.Select>

            {/* Items Per Page */}
            <Form.Select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </Form.Select>
          </div>

          {/* Filter summary bar */}
          <div className={styles.filterSummary}>
            <div className={styles.activeFilters}>
              <span>
                Found <strong>{totalItems}</strong> matching{" "}
                {totalItems === 1 ? "tour" : "tours"}
              </span>
              {isFiltered && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-decoration-none d-flex align-items-center gap-1 ms-2 text-danger"
                  onClick={handleResetFilters}
                >
                  <ArrowCounterclockwise /> Reset Filters
                </Button>
              )}
            </div>

            <div>
              <span>
                Page {safeCurrentPage} of {totalPages}
              </span>
            </div>
          </div>
        </div>

        {/* Tours Table */}
        <div className={styles.tableWrapper}>
          <Table striped hover responsive className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "65px" }}>Image</th>
                <th>Tour Name & Slug</th>
                <th>Category</th>
                <th>Location / Region</th>
                <th>Flags</th>
                <th>Created At</th>
                <th style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTours.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    {isFiltered
                      ? "No tours match the selected filters. Try adjusting your search."
                      : "No tours found in database."}
                  </td>
                </tr>
              ) : (
                paginatedTours.map((tour) => {
                  const imageUrl =
                    getImageUrl(tour.main_image) || "/tour.png";
                  const categoryClass = styles[tour.category_type] || styles.default;

                  let flagsObj = tour.flags;
                  if (typeof flagsObj === "string") {
                    try {
                      flagsObj = JSON.parse(flagsObj);
                    } catch (e) {
                      flagsObj = {};
                    }
                  }

                  return (
                    <tr key={tour.id}>
                      <td>
                        <img
                          src={imageUrl}
                          alt={tour.name}
                          className={styles.tourThumbnail}
                          onError={(e) => {
                            e.currentTarget.src = "/tour.png";
                          }}
                        />
                      </td>
                      <td>
                        <div className={styles.tourInfo}>
                          <Link
                            href={`/admin/tours/${tour.id}`}
                            className={styles.tourLink}
                          >
                            {tour.name}
                          </Link>
                          {tour.slug && (
                            <span className={styles.tourSlug}>/{tour.slug}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.categoryBadge} ${categoryClass}`}>
                          {tour.category_type}
                        </span>
                      </td>
                      <td>
                        <div>
                          <span>{tour.state_country || "—"}</span>
                          {tour.region_continent && (
                            <div className="text-muted small">
                              {tour.region_continent}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        {flagsObj?.is_featured && (
                          <span className={`${styles.flagBadge} ${styles.featured}`}>
                            Featured
                          </span>
                        )}
                        {flagsObj?.is_trending && (
                          <span className={`${styles.flagBadge} ${styles.trending}`}>
                            Trending
                          </span>
                        )}
                        {!flagsObj?.is_featured && !flagsObj?.is_trending && (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                      <td>
                        {tour.created_at
                          ? new Date(tour.created_at).toLocaleDateString()
                          : "—"}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <Link
                            href={`/tours/${tour.slug}`}
                            target="_blank"
                            className="btn btn-outline-secondary btn-sm"
                            title="View tour on website"
                          >
                            <BoxArrowUpRight size={13} />
                          </Link>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => router.push(`/admin/tours/${tour.id}`)}
                            title="Edit tour"
                          >
                            <PencilSquare size={13} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(tour.id, tour.name)}
                            title="Delete tour"
                          >
                            <Trash size={13} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          {totalItems > 0 && (
            <div className={styles.paginationWrapper}>
              <div className={styles.pageInfo}>
                Showing <strong>{startIndex + 1}</strong> to{" "}
                <strong>{endIndex}</strong> of <strong>{totalItems}</strong> tours
              </div>

              {totalPages > 1 && (
                <Pagination className={styles.pagination}>
                  <Pagination.First
                    disabled={safeCurrentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  />
                  <Pagination.Prev
                    disabled={safeCurrentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  />

                  {renderPaginationItems()}

                  <Pagination.Next
                    disabled={safeCurrentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  />
                  <Pagination.Last
                    disabled={safeCurrentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                  />
                </Pagination>
              )}
            </div>
          )}
        </div>
      </CustomContainer>
    </div>
  );
};

export default AdminToursList;
