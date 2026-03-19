using Baltsped.Tools.Server.Database.SqlServer.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Baltsped.Tools.Server.Database.SqlServer.Configurations;

// Конфигурация таблицы Target для EF Core
internal class TargetConfiguration : IEntityTypeConfiguration<Target>
{
    public void Configure(EntityTypeBuilder<Target> builder)
    {
        builder.ToTable("Target", "dbo");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("Id");

        builder.Property(x => x.Code)
            .HasColumnName("Code")
            .HasMaxLength(64);
    }
}
